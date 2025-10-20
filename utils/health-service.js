import healthConfig, { getDataTypeInfo, getProviderInfo } from '@/config/health-config.js'

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

      // 获取用户偏好设置
      const preferences = this.getUserPreferences()
      const providers = preferences.preferredProviders || ['wechat', 'xiaomi', 'huawei']

      let combinedData = this.getDefaultHealthData()

      // 并行获取各平台数据
      const promises = providers.map(provider => this.getProviderData(provider))
      const results = await Promise.allSettled(promises)

      // 合并数据
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const provider = providers[index]
          combinedData = this.mergeHealthData(combinedData, result.value, provider)
        }
      })

      // 保存到本地
      this.saveLocalHealthData(combinedData)
      this.saveSyncTime()

      // 保存到云数据库
      await this.saveHealthDataToCloud(combinedData)

      if (showLoading) {
        uni.hideLoading()
        uni.showToast({
          title: '同步成功',
          icon: 'success'
        })
      }

      return combinedData

    } catch (error) {
      console.error('同步健康数据失败:', error)
      if (showLoading) {
        uni.hideLoading()
        uni.showToast({
          title: '同步失败，请重试',
          icon: 'none'
        })
      }
      throw error
    }
  }

  // 获取特定提供商数据
  async getProviderData(provider) {
    try {
      const result = await uniCloud.callFunction({
        name: healthConfig.cloudFunctions.getHealthData,
        data: {
          provider: provider,
          type: ['steps', 'sleep', 'heartRate', 'bloodPressure']
        }
      })

      if (result.result && result.result.code === 0) {
        return result.result.data
      } else {
        throw new Error(result.result?.message || '获取数据失败')
      }

    } catch (error) {
      console.error(`获取${provider}数据失败:`, error)
      return null
    }
  }

  // 合并健康数据
  mergeHealthData(currentData, newData, provider) {
    const merged = { ...currentData }

    // 数据优先级：xiaomi > huawei > wechat > manual
    const providerPriority = { xiaomi: 3, huawei: 2, wechat: 1, manual: 0 }
    const currentPriority = providerPriority[provider] || 0

    // 获取当前数据的提供商信息
    const providerStatus = this.getProviderStatus()

    // 合并步数数据
    if (newData.steps && this.shouldUpdateData('steps', provider, providerStatus)) {
      merged.steps = this.formatStepsData(newData.steps)
    }

    // 合并睡眠数据
    if (newData.sleepHours && this.shouldUpdateData('sleep', provider, providerStatus)) {
      merged.sleepHours = newData.sleepHours
    }

    // 合并心率数据
    if (newData.heartRate && this.shouldUpdateData('heartRate', provider, providerStatus)) {
      merged.heartRate = newData.heartRate
    }

    // 合并血压数据
    if (newData.bloodPressure && this.shouldUpdateData('bloodPressure', provider, providerStatus)) {
      merged.bloodPressure = newData.bloodPressure
    }

    return merged
  }

  // 判断是否应该更新数据
  shouldUpdateData(dataType, provider, providerStatus) {
    // 如果没有当前数据，直接更新
    if (!providerStatus[dataType]) {
      return true
    }

    // 如果新提供商优先级更高，更新数据
    const providerPriority = { xiaomi: 3, huawei: 2, wechat: 1, manual: 0 }
    const currentPriority = providerPriority[providerStatus[dataType]] || 0
    const newPriority = providerPriority[provider] || 0

    return newPriority > currentPriority
  }

  // 格式化步数数据
  formatStepsData(steps) {
    const num = typeof steps === 'string' ? parseInt(steps) : steps
    return isNaN(num) ? '0' : num.toLocaleString()
  }

  // 获取提供商状态
  getProviderStatus() {
    try {
      const status = uni.getStorageSync(this.storageKeys.providerStatus)
      return status || {}
    } catch (error) {
      console.error('获取提供商状态失败:', error)
      return {}
    }
  }

  // 保存提供商状态
  saveProviderStatus(status) {
    try {
      uni.setStorageSync(this.storageKeys.providerStatus, status)
      return true
    } catch (error) {
      console.error('保存提供商状态失败:', error)
      return false
    }
  }

  // 获取用户偏好设置
  getUserPreferences() {
    try {
      const prefs = uni.getStorageSync(this.storageKeys.userPreferences)
      return prefs || healthConfig.defaultPreferences
    } catch (error) {
      console.error('获取用户偏好设置失败:', error)
      return healthConfig.defaultPreferences
    }
  }

  // 保存用户偏好设置
  saveUserPreferences(preferences) {
    try {
      const mergedPrefs = { ...healthConfig.defaultPreferences, ...preferences }
      uni.setStorageSync(this.storageKeys.userPreferences, mergedPrefs)
      return true
    } catch (error) {
      console.error('保存用户偏好设置失败:', error)
      return false
    }
  }

  // 保存健康数据到云数据库
  async saveHealthDataToCloud(healthData) {
    try {
      const userInfo = this.getCurrentUserInfo()
      if (!userInfo || !userInfo.userId) {
        console.log('用户未登录，跳过云端保存')
        return
      }

      const db = uniCloud.database()
      const collection = db.collection('health-data')
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 保存各类型数据
      const dataTypes = ['steps', 'sleep', 'heartRate', 'bloodPressure']
      const documents = dataTypes.map(type => ({
        userId: userInfo.userId,
        dataDate: today, // 确保是Date类型
        provider: 'system',
        type: type,
        value: String(healthData[type] || 0), // 确保是字符串
        unit: getDataTypeInfo(type)?.unit || '',
        syncTime: new Date(),
        isValid: true
      }))

      // 使用add而不是Promise.all，避免并发问题
      for (const doc of documents) {
        try {
          await collection.add(doc)
          console.log(`健康数据(${doc.type})已保存到云数据库`)
        } catch (err) {
          console.error(`保存${doc.type}数据失败:`, err)
          // 单个数据保存失败不影响其他数据
        }
      }

    } catch (error) {
      console.error('保存健康数据到云数据库失败:', error)
      // 不抛出错误，避免影响主要流程
    }
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

  // 解析微信步数数据
  async decryptWechatSteps(encryptedData, iv, sessionKey) {
    try {
      const result = await uniCloud.callFunction({
        name: healthConfig.cloudFunctions.decryptWechatSteps,
        data: {
          encryptedData,
          iv,
          sessionKey
        }
      })

      if (result.result && result.result.code === 0) {
        return result.result.data
      } else {
        throw new Error(result.result?.message || '解密失败')
      }

    } catch (error) {
      console.error('解密微信步数失败:', error)
      throw error
    }
  }
}

// 创建单例实例
const healthService = new HealthService()

export default healthService