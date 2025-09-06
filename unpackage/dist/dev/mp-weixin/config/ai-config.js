"use strict";
const AI_CONFIG = {
  // 方案一：OpenAI兼容API (如ChatGLM、通义千问等)
  openai_compatible: {
    apiUrl: "https://your-api-endpoint.com/v1/chat/completions",
    apiKey: "your-api-key-here",
    model: "your-model-name",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-api-key-here"
    }
  },
  // 方案二：自定义API格式
  custom_api: {
    apiUrl: "https://your-custom-api.com/chat",
    apiKey: "your-api-key",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "your-api-key"
    },
    // 自定义请求格式转换函数
    formatRequest: (message) => {
      return {
        query: message,
        history: [],
        stream: false
      };
    },
    // 自定义响应格式解析函数
    parseResponse: (response) => {
      return response.data.answer || response.data.response;
    }
  },
  // 方案三：WebSocket连接
  websocket: {
    wsUrl: "wss://your-websocket-endpoint.com/chat",
    apiKey: "your-api-key"
  },
  // 方案四：本地部署的大模型
  local_model: {
    apiUrl: "http://localhost:8000/chat",
    timeout: 3e4
    // 本地模型可能需要更长的响应时间
  },
  // 通用配置
  common: {
    maxTokens: 1e3,
    temperature: 0.7,
    timeout: 15e3,
    retryTimes: 3,
    systemPrompt: "你是一个专业的医疗助手，请根据用户描述的症状提供专业的医疗建议。注意：你的建议仅供参考，严重情况请及时就医。"
  }
};
const CURRENT_CONFIG = "openai_compatible";
exports.AI_CONFIG = AI_CONFIG;
exports.CURRENT_CONFIG = CURRENT_CONFIG;
//# sourceMappingURL=../../.sourcemap/mp-weixin/config/ai-config.js.map
