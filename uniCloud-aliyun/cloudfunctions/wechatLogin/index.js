'use strict';
const db = uniCloud.database()
const collection = db.collection('users')

exports.main = async (event, context) => {
  console.log('微信登录云函数被调用:', event)

  try {
    // 获取微信登录信息
    const { code } = event

    if (!code) {
      return {
        code: 400,
        message: '缺少微信授权码'
      }
    }

    // 调用微信API获取session_key和openid
    // 使用真实的微信小程序AppID和AppSecret
    const wxAppId = 'wx121837575fd549e6'
    const wxAppSecret = '45cdeeb69b02aa79bde8bb830d897ce9'

    const wxRes = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
      method: 'GET',
      data: {
        appid: wxAppId,
        secret: wxAppSecret,
        js_code: code,
        grant_type: 'authorization_code'
      },
      dataType: 'json'
    })

    console.log('微信API响应:', wxRes.data)

    if (wxRes.data.errcode) {
      return {
        code: wxRes.data.errcode,
        message: `微信登录失败: ${wxRes.data.errmsg}`
      }
    }

    const { openid, session_key } = wxRes.data

    // 查询用户是否已存在
    const userRes = await collection.where({
      openid: openid
    }).get()

    let userInfo
    let token

    if (userRes.data.length > 0) {
      // 用户已存在，更新最后登录时间
      const user = userRes.data[0]
      await collection.doc(user._id).update({
        lastLoginTime: new Date(),
        sessionKey: session_key
      })

      userInfo = {
        userId: user._id,
        openid: user.openid,
        name: user.name || '微信用户',
        avatar: user.avatar || '',
        phone: user.phone || '',
        createTime: user.createTime,
        tagline: user.tagline || '健康生活，从我做起',
        vipLevel: user.vipLevel || 1,
        vipEndDate: user.vipLevel === 1 ? '永久有效' : (user.vipEndDate || '2023-12-31')
      }

      token = `token_${user._id}_${Date.now()}`
    } else {
      // 新用户，创建用户记录
      const createRes = await collection.add({
        openid: openid,
        sessionKey: session_key,
        name: '微信用户',
        avatar: '',
        phone: '',
        createTime: new Date(),
        lastLoginTime: new Date(),
        tagline: '健康生活，从我做起',
        vipLevel: 1,
        vipEndDate: '永久有效'
      })

      userInfo = {
        userId: createRes.id,
        openid: openid,
        name: '微信用户',
        avatar: '',
        phone: '',
        createTime: new Date(),
        tagline: '健康生活，从我做起',
        vipLevel: 1,
        vipEndDate: '永久有效'
      }

      token = `token_${createRes.id}_${Date.now()}`
    }

    // 返回登录成功信息
    return {
      code: 0,
      message: '登录成功',
      token: token,
      userInfo: userInfo
    }

  } catch (error) {
    console.error('微信登录云函数错误:', error)
    return {
      code: 500,
      message: '服务器内部错误',
      error: error.message
    }
  }
}