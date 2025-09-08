/**
 * AI配置文件
 * 包含各种AI服务的配置信息
 */

// 当前使用的AI配置
const CURRENT_CONFIG = 'ALIYUN_BAILIAN';

// 各种AI服务配置
const AI_CONFIGS = {
  // 阿里云百炼配置
  ALIYUN_BAILIAN: {
    appId: 'c70564591b854bbd8b7fb4ddd20582e0',
    apiKey: 'sk-7f99ba359d6f4c7b98924e1cc71e28d6',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/apps',
    modelName: 'qwen-max', // 可根据需要更换模型
    enableThoughts: false, // 是否启用思考过程
    streamOutput: true // 是否启用流式输出
  },

  // 其他可能的配置可以在这里添加
  // 例如OpenAI, ChatGLM等
};

// 获取当前配置
function getCurrentConfig() {
  return AI_CONFIGS[CURRENT_CONFIG];
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CURRENT_CONFIG,
    AI_CONFIGS,
    getCurrentConfig
  };
}

// ES6导出
if (typeof exports !== 'undefined') {
  exports.CURRENT_CONFIG = CURRENT_CONFIG;
  exports.AI_CONFIGS = AI_CONFIGS;
  exports.getCurrentConfig = getCurrentConfig;
}