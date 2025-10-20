import healthConfig, { getDataTypeInfo } from '@/config/health-config.js'

class HealthService {
  constructor() {
    this.storageKeys = healthConfig.storageKeys
  }

  // 获取本地健康数据
  getLocalHealthData() {
    try {
      const data = uni.getStorageSync(this.storageKeys.healthData)
      return data ? JSON.parse(data) : this.getDefaultHealthData()
    } catch (error) {
      console.error('获取本地健康数据失败:', error)
      return this.getDefaultHealthData()
    }
  }

  // 保存本地健康数据
  saveLocalHealthData(data) {
    try {
      uni.setStorageSync(this.storageKeys.healthData, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('保存本地健康数据失败:', error)
      return false
    }
  }

  // 获取默认健康数据
  getDefaultHealthData() {
    return {
      steps: '0',
      sleepHours: '0',
      heartRate: '0',
      bloodPressure: '0/0'
    }
  }

  // 获取最后同步时间
  getLastSyncTime() {
    return uni.getStorageSync(this.storageKeys.lastSyncTime) || 0
  }

  // 保存同步时间
  saveSyncTime() {
    uni.setStorageSync(this.storageKeys.lastSyncTime, Date.now())
  }

  // 检查是否需要同步
  needSync() {
    const lastSync = this.getLastSyncTime()
    const now = Date.now()
    return (now - lastSync) > healthConfig.sync.autoSyncInterval
  }

  // 同步健康数据
  async syncHealthData(showLoading = true) {
    try {
      if (showLoading) {
        uni.showLoading({
          title: '同步中...'
        })
      }

      // 获取微信步数
      const steps = await this.getWechatSteps()

      // 创建健康数据对象
      const healthData = {
        steps: steps.toLocaleString(),
        sleepHours: '0', // 暂时无法获取
        heartRate: '0', // 暂时无法获取
        bloodPressure: '0/0' // 暂时无法获取
      }

      // 保存到本地
      this.saveLocalHealthData(healthData)
      this.saveSyncTime()

      if (showLoading) {
        uni.hideLoading()
        uni.showToast({
          title: '同步成功',
          icon: 'success'
        })
      }

      return healthData

    } catch (error) {
      console.error('同步健康数据失败:', error)
      if (showLoading) {
        uni.hideLoading()
        uni.showToast({
          title: error.message || '同步失败',
          icon: 'none'
        })
      }

      // 返回本地缓存的数据
      return this.getLocalHealthData()
    }
  }

  // 通过云函数解密微信步数
  async decryptWechatStepsData(encryptedData, iv) {
    try {
      // 获取用户信息（包含 openid）
      const userInfo = this.getCurrentUserInfo()
      if (!userInfo || !userInfo.openid) {
        throw new Error('未找到用户信息，请先登录')
      }

      console.log('调用云函数解密微信步数数据...')

      // 调用云函数解密
      const res = await uniCloud.callFunction({
        name: 'decryptWechatSteps',
        data: {
          encryptedData: encryptedData,
          iv: iv,
          openid: userInfo.openid
        }
      })

      console.log('云函数解密响应:', res)

      if (res.result.code === 0) {
        const stepsData = res.result.data.steps
        return stepsData.today || 0
      } else {
        throw new Error(res.result.message || '解密失败')
      }

    } catch (error) {
      console.error('解密微信步数数据失败:', error)
      throw error
    }
  }

  // 获取微信步数
  async getWechatSteps() {
    return new Promise(async (resolve, reject) => {
      // 检查是否在微信环境
      const platform = uni.getSystemInfoSync().platform
      console.log('当前平台:', platform)

      // 判断是否在微信小程序环境
      if (typeof wx === 'undefined') {
        console.log('不在微信环境中')
        reject(new Error('请在微信小程序中使用'))
        return
      }

      // 调用微信运动API
      console.log('开始获取微信运动数据...')
      wx.getWeRunData({
        success: async (res) => {
          console.log('微信运动数据获取成功:', res)

          try {
            // 检查是否有直接返回的步数列表
            if (res.stepInfoList && Array.isArray(res.stepInfoList) && res.stepInfoList.length > 0) {
              // 获取最新一天的步数（通常是今天）
              const latestStep = res.stepInfoList[0]
              const steps = latestStep.step || 0
              console.log('获取到步数:', steps)
              resolve(steps)
            } else if (res.encryptedData && res.iv) {
              // 返回了加密数据，需要通过云函数解密
              console.log('获取到加密数据，调用云函数解密...')
              try {
                const steps = await this.decryptWechatStepsData(res.encryptedData, res.iv)
                console.log('解密后获取到步数:', steps)
                resolve(steps)
              } catch (decryptError) {
                console.error('解密失败:', decryptError)
                reject(new Error('步数数据解密失败: ' + decryptError.message))
              }
            } else {
              console.log('未获取到有效的步数数据')
              resolve(0)
            }
          } catch (error) {
            console.error('处理微信步数数据失败:', error)
            reject(error)
          }
        },
        fail: (err) => {
          console.error('获取微信步数失败:', err)

          // 判断错误类型
          if (err.errMsg && err.errMsg.includes('auth deny')) {
            reject(new Error('请授权微信运动权限'))
          } else if (err.errMsg && err.errMsg.includes('not yet implemented')) {
            reject(new Error('当前环境不支持微信运动API'))
          } else {
            reject(new Error('获取微信步数失败: ' + (err.errMsg || '未知错误')))
          }
        }
      })
    })
  }

  // 获取当前用户信息
  getCurrentUserInfo() {
    try {
      const userInfoStr = uni.getStorageSync('userInfo')
      return userInfoStr ? JSON.parse(userInfoStr) : null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }
}

// 创建单例实例
const healthService = new HealthService()

export default healthService