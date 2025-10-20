// 环境配置文件
const envConfig = {
  // 开发环境配置
  development: {
    enableMockLogin: true,
    showLoginTips: true,
    logLevel: 'debug'
  },

  // 生产环境配置
  production: {
    enableMockLogin: false,
    showLoginTips: false,
    logLevel: 'error'
  }
}

// 获取当前环境
function getCurrentEnv() {
  // 始终使用生产环境
  return 'production';
}

// 导出当前环境配置
const currentEnv = getCurrentEnv();
const config = {
  ...envConfig[currentEnv],
  env: currentEnv
};

export default config;