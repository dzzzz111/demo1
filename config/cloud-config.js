// 云函数配置
const cloudConfig = {
  // 微信小程序配置
  wechat: {
    // 开发环境配置
    development: {
      appId: 'wx1234567890abcdef', // 开发环境AppID
      appSecret: 'development_app_secret_placeholder' // 开发环境AppSecret
    },

    // 生产环境配置
    production: {
      appId: '', // 请填写真实的生产环境AppID
      appSecret: '' // 请填写真实的生产环境AppSecret
    }
  },

  // 小米健康配置
  xiaomi: {
    development: {
      appId: 'xiaomi_dev_app_id',
      appSecret: 'xiaomi_dev_app_secret',
      apiEndpoint: 'https://api.mi.com/health/dev'
    },
    production: {
      appId: '', // 请填写小米健康生产环境AppID
      appSecret: '', // 请填写小米健康生产环境AppSecret
      apiEndpoint: 'https://api.mi.com/health'
    }
  },

  // 华为健康配置
  huawei: {
    development: {
      appId: 'huawei_dev_app_id',
      appSecret: 'huawei_dev_app_secret',
      apiEndpoint: 'https://health.huawei.com/api/dev'
    },
    production: {
      appId: '', // 请填写华为健康生产环境AppID
      appSecret: '', // 请填写华为健康生产环境AppSecret
      apiEndpoint: 'https://health.huawei.com/api'
    }
  },

  // 获取当前环境
  getCurrentEnv() {
    // 可以根据不同条件判断环境
    try {
      const systemInfo = uni.getSystemInfoSync();
      // 如果在开发工具中运行，使用开发环境
      if (systemInfo.platform === 'devtools' || systemInfo.platform === 'h5') {
        return 'development';
      }
    } catch (e) {
      console.error('获取环境信息失败:', e);
    }

    // 默认使用生产环境
    return 'production';
  },

  // 获取配置
  getConfig(service) {
    const env = this.getCurrentEnv();
    return this[service]?.[env] || {};
  }
}

export default cloudConfig;