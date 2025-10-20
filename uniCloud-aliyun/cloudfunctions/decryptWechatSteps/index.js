'use strict';

const db = uniCloud.database()
const usersCollection = db.collection('users')

exports.main = async (event, context) => {
  console.log('微信步数解密云函数被调用:', event)

  try {
    const { encryptedData, iv, openid } = event

    if (!encryptedData || !iv || !openid) {
      return {
        code: 400,
        message: '缺少必要参数'
      }
    }

    // 从数据库获取用户的 sessionKey
    const userRes = await usersCollection.where({
      openid: openid
    }).get()

    if (userRes.data.length === 0) {
      return {
        code: 404,
        message: '未找到用户信息'
      }
    }

    const user = userRes.data[0]
    const sessionKey = user.sessionKey

    if (!sessionKey) {
      return {
        code: 400,
        message: '未找到 sessionKey，请重新登录'
      }
    }

    console.log('准备解密，sessionKey已获取')

    // 解密微信运动数据
    const decryptedData = decryptWechatData(encryptedData, iv, sessionKey)

    if (!decryptedData) {
      return {
        code: 500,
        message: '数据解密失败'
      }
    }

    console.log('解密成功，解析步数数据...')

    // 解析步数数据
    const stepsData = parseStepsData(decryptedData)

    return {
      code: 0,
      message: '解密成功',
      data: {
        steps: stepsData,
        rawData: decryptedData
      }
    }

  } catch (error) {
    console.error('微信步数解密失败:', error)
    return {
      code: 500,
      message: '服务器内部错误',
      error: error.message
    }
  }
}

// 解密微信数据
function decryptWechatData(encryptedData, iv, sessionKey) {
  try {
    // 使用crypto库进行AES解密
    const crypto = require('crypto')

    // 创建解密器
    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      Buffer.from(sessionKey, 'base64'),
      Buffer.from(iv, 'base64')
    )

    decipher.setAutoPadding(true)

    // 解密数据
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted)

  } catch (error) {
    console.error('解密过程出错:', error)
    return null
  }
}

// 解析步数数据
function parseStepsData(decryptedData) {
  try {
    if (!decryptedData.stepInfoList || !Array.isArray(decryptedData.stepInfoList)) {
      throw new Error('无效的步数数据格式')
    }

    console.log('stepInfoList:', JSON.stringify(decryptedData.stepInfoList))

    // 获取今天的日期（只比较日期，不比较时间）
    const now = new Date()
    const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    console.log('今天的日期:', todayDateStr)

    // 微信返回的步数列表是按时间倒序排列的（最新的在前面）
    // stepInfoList 中的 timestamp 是秒级时间戳
    let todayStepInfo = null

    for (let i = 0; i < decryptedData.stepInfoList.length; i++) {
      const item = decryptedData.stepInfoList[i]
      // timestamp 是秒级时间戳，需要乘以 1000 转换为毫秒
      const itemDate = new Date(item.timestamp * 1000)
      const itemDateStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`

      console.log(`第${i}条数据 - 日期: ${itemDateStr}, 步数: ${item.step}`)

      if (itemDateStr === todayDateStr) {
        todayStepInfo = item
        console.log('找到今天的数据:', item)
        break
      }
    }

    // 如果没有找到今天的数据，使用最新一天的数据（第一条）
    if (!todayStepInfo && decryptedData.stepInfoList.length > 0) {
      todayStepInfo = decryptedData.stepInfoList[0]
      console.log('未找到今天的数据，使用最新数据:', todayStepInfo)
    }

    // 计算最近7天的总步数
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekTotal = decryptedData.stepInfoList
      .filter(item => {
        const itemDate = new Date(item.timestamp * 1000)
        return itemDate >= sevenDaysAgo
      })
      .reduce((sum, item) => sum + item.step, 0)

    const result = {
      today: todayStepInfo ? todayStepInfo.step : 0,
      week: weekTotal,
      daily: decryptedData.stepInfoList.map(item => {
        const itemDate = new Date(item.timestamp * 1000)
        return {
          date: `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`,
          steps: item.step
        }
      })
    }

    console.log('解析结果:', JSON.stringify(result))

    return result

  } catch (error) {
    console.error('解析步数数据失败:', error)
    return {
      today: 0,
      week: 0,
      daily: []
    }
  }
}