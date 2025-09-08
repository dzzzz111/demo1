# AI大模型集成指南

## 🚀 快速开始

### 1. 配置您的大模型

编辑 `config/ai-config.js` 文件，根据您的大模型类型选择相应的配置：

#### 方案一：OpenAI兼容API（推荐）
适用于：ChatGLM、通义千问、文心一言、智谱AI等

```javascript
openai_compatible: {
  apiUrl: 'https://your-api-endpoint.com/v1/chat/completions',
  apiKey: 'your-api-key-here',
  model: 'your-model-name',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key-here'
  }
}
```

#### 方案二：自定义API格式
适用于：自研大模型或特殊API格式

```javascript
custom_api: {
  apiUrl: 'https://your-custom-api.com/chat',
  apiKey: 'your-api-key',
  formatRequest: (message, history) => {
    return {
      query: message,
      history: history,
      stream: false
    };
  },
  parseResponse: (response) => {
    return response.data.answer;
  }
}
```

#### 方案三：WebSocket连接
适用于：需要实时流式响应的场景

```javascript
websocket: {
  wsUrl: 'wss://your-websocket-endpoint.com/chat',
  apiKey: 'your-api-key'
}
```

#### 方案四：本地部署模型
适用于：本地部署的大模型服务

```javascript
local_model: {
  apiUrl: 'http://localhost:8000/chat',
  timeout: 30000
}
```

### 2. 选择配置方案

在 `config/ai-config.js` 文件底部修改：

```javascript
export const CURRENT_CONFIG = 'openai_compatible'; // 选择您的配置方案
```

### 3. 测试连接

启动应用，进入AI智能问诊页面，发送测试消息验证连接是否正常。

## 🔧 常见大模型配置示例

### ChatGLM-6B/130B
```javascript
openai_compatible: {
  apiUrl: 'http://your-server:8000/v1/chat/completions',
  model: 'chatglm-6b',
  headers: {
    'Content-Type': 'application/json'
  }
}
```

### 通义千问
```javascript
openai_compatible: {
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  apiKey: 'your-dashscope-api-key',
  model: 'qwen-turbo',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-dashscope-api-key'
  }
}
```

### 文心一言
```javascript
custom_api: {
  apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
  apiKey: 'your-access-token',
  formatRequest: (message) => {
    return {
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    };
  },
  parseResponse: (response) => {
    return response.data.result;
  }
}
```

## 🛠️ 高级配置

### 自定义系统提示词
在 `config/ai-config.js` 中修改：

```javascript
common: {
  systemPrompt: '你是一个专业的医疗助手，具有丰富的医学知识...'
}
```

### 调整模型参数
```javascript
common: {
  maxTokens: 2000,      // 最大输出长度
  temperature: 0.7,     // 创造性程度 (0-1)
  timeout: 30000,       // 请求超时时间
  retryTimes: 3         // 重试次数
}
```

## 🔍 故障排除

### 1. API调用失败
- 检查API地址是否正确
- 验证API密钥是否有效
- 确认网络连接正常

### 2. 响应格式错误
- 检查 `parseResponse` 函数是否正确解析响应
- 查看控制台错误信息
- 验证API返回的数据格式

### 3. 超时问题
- 增加 `timeout` 配置值
- 检查模型服务器性能
- 考虑使用流式响应

## 📝 开发建议

1. **测试环境**：先在测试环境验证配置
2. **错误处理**：完善错误提示和用户反馈
3. **性能优化**：考虑缓存和请求优化
4. **安全性**：保护API密钥，使用HTTPS
5. **监控**：添加日志和监控机制

## 🤝 技术支持

如果您在集成过程中遇到问题，请：
1. 查看控制台错误信息
2. 检查网络请求和响应
3. 参考大模型官方文档
4. 联系技术支持团队
