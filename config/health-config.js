// 健康数据配置
const healthConfig = {
  // 支持的健康数据提供商
  providers: {
    xiaomi: {
      name: '小米健康',
      apiEndpoint: 'https://api.mi.com/health',
      supportedTypes: ['sleep', 'heartRate', 'bloodPressure', 'steps'],
      authRequired: true,
      description: '需要绑定小米运动App'
    },
    huawei: {
      name: '华为健康',
      apiEndpoint: 'https://health.huawei.com/api',
      supportedTypes: ['sleep', 'heartRate', 'bloodPressure', 'steps'],
      authRequired: true,
      description: '需要绑定华为运动健康App'
    },
    wechat: {
      name: '微信运动',
      apiEndpoint: 'wechat://werun',
      supportedTypes: ['steps'],
      authRequired: true,
      description: '需要授权微信运动'
    }
  },

  // 数据类型配置
  dataTypes: {
    steps: {
      name: '步数',
      unit: '步',
      icon: '👟',
      color: '#4CAF50',
      normalRange: { min: 5000, max: 15000 }
    },
    sleep: {
      name: '睡眠',
      unit: '小时',
      icon: '😴',
      color: '#9C27B0',
      normalRange: { min: 6, max: 9 }
    },
    heartRate: {
      name: '心率',
      unit: '次/分',
      icon: '❤️',
      color: '#F44336',
      normalRange: { min: 60, max: 100 }
    },
    bloodPressure: {
      name: '血压',
      unit: 'mmHg',
      icon: '💉',
      color: '#FF9800',
      normalRange: { min: '90/60', max: '140/90' }
    }
  },

  // 同步配置
  sync: {
    // 自动同步间隔（毫秒）
    autoSyncInterval: 24 * 60 * 60 * 1000, // 24小时

    // 同步失败重试次数
    maxRetries: 3,

    // 同步超时时间（毫秒）
    timeout: 10000,

    // 数据缓存时间（毫秒）
    cacheTime: 12 * 60 * 60 * 1000 // 12小时
  },

  // 数据存储键名
  storageKeys: {
    healthData: 'healthData',
    lastSyncTime: 'lastHealthSyncTime',
    providerStatus: 'healthProviderStatus',
    userPreferences: 'healthUserPreferences'
  },

  // 云函数名称
  cloudFunctions: {
    getHealthData: 'getHealthData',
    decryptWechatSteps: 'decryptWechatSteps',
    saveHealthData: 'saveHealthData'
  },

  // 默认用户偏好设置
  defaultPreferences: {
    autoSync: true,
    notifications: true,
    shareData: false,
    preferredProviders: ['wechat', 'xiaomi', 'huawei']
  }
}

// 获取数据类型信息
export function getDataTypeInfo(type) {
  return healthConfig.dataTypes[type] || null
}

// 获取提供商信息
export function getProviderInfo(provider) {
  return healthConfig.providers[provider] || null
}

// 获取所有支持的提供商
export function getAllProviders() {
  return Object.keys(healthConfig.providers).map(key => ({
    key,
    ...healthConfig.providers[key]
  }))
}

// 获取所有支持的数据类型
export function getAllDataTypes() {
  return Object.keys(healthConfig.dataTypes).map(key => ({
    key,
    ...healthConfig.dataTypes[key]
  }))
}

export default healthConfig