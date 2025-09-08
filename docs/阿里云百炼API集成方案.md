# 阿里云百炼API集成到AI诊断对话的方案

## 1. 架构分析

根据API文档分析，阿里云百炼平台提供了一个完整的智能体应用集成方案，支持多种交互模式：
- 多轮对话管理（通过session_id自动维护上下文）
- 流式输出支持
- 自定义参数传递
- 知识库检索增强
- 长期记忆功能
- 文件上传与解析

## 2. 设计方案

### 2.1 核心集成架构
```
UniApp前端 ↔ 本地AI服务层 ↔ 阿里云百炼API ↔ 智能体应用
```

### 2.2 关键实现点

1. **对话管理**：
   - 使用session_id实现多轮对话上下文管理
   - 自动维护会话状态，确保诊断连贯性

2. **医疗专用提示词**：
   - 设计医疗场景专用prompt模板
   - 支持症状描述、病史采集、诊断建议等结构化交互

3. **流式响应处理**：
   - 实现实时文本输出，提升用户体验
   - 支持思考过程显示（针对深度思考模型）

4. **参数定制**：
   - 通过biz_params传递用户医疗数据
   - 支持个性化诊断参数设置

## 3. 开发环境与配置

### 3.1 环境要求
- Node.js >= 12.0
- UniApp开发环境（HBuilderX）
- 网络可访问阿里云服务

### 3.2 项目配置
在`config/ai-config.js`中添加阿里云百炼配置：

```javascript
// 阿里云百炼配置
ALIYUN_BAILIAN: {
  appId: 'c70564591b854bbd8b7fb4ddd20582e0',
  apiKey: 'sk-7f99ba359d6f4c7b98924e1cc71e28d6',
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/apps',
  modelName: 'qwen-max', // 可根据需要更换模型
  enableThoughts: false, // 是否启用思考过程
  streamOutput: true // 是否启用流式输出
}
```

### 3.3 在utils/ai-service.js中添加集成代码

```javascript
// 阿里云百炼API集成
class AliyunBailianService {
  constructor(config) {
    this.appId = config.appId;
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl;
    this.modelName = config.modelName;
    this.enableThoughts = config.enableThoughts;
    this.streamOutput = config.streamOutput;
  }

  // 构建API请求URL
  getApiUrl() {
    return `${this.apiUrl}/${this.appId}/completion`;
  }

  // 发送诊断请求
  async sendDiagnosisRequest(messages, sessionId = null, options = {}) {
    const url = this.getApiUrl();
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    // 如果启用流式输出，添加相应头部
    if (this.streamOutput) {
      headers['X-DashScope-SSE'] = 'enable';
    }

    const data = {
      input: {
        messages: messages
      },
      parameters: {
        incremental_output: this.streamOutput
      },
      debug: {}
    };

    // 如果提供了sessionId，添加到请求中
    if (sessionId) {
      data.input.session_id = sessionId;
    }

    // 如果启用了思考过程，添加相应参数
    if (this.enableThoughts) {
      data.parameters.has_thoughts = true;
    }

    // 添加自定义参数
    if (options.bizParams) {
      data.input.biz_params = options.bizParams;
    }

    try {
      const response = await uni.request({
        url: url,
        method: 'POST',
        header: headers,
        data: data
      });

      return response.data;
    } catch (error) {
      console.error('阿里云百炼API调用失败:', error);
      throw error;
    }
  }
}
```

## 4. 实施计划

### 4.1 第一阶段：基础集成
1. 在`utils/ai-service.js`中实现阿里云百炼服务类
2. 更新`config/ai-config.js`添加配置项
3. 在AI医生页面集成新服务

### 4.2 第二阶段：功能完善
1. 实现多轮对话管理
2. 添加流式输出支持
3. 集成思考过程显示（如需要）

### 4.3 第三阶段：优化与扩展
1. 添加错误处理和重试机制
2. 实现知识库检索功能
3. 集成长期记忆功能

## 5. 使用示例

在AI医生对话页面中使用：

```javascript
// 初始化服务
const aiService = new AliyunBailianService({
  appId: 'c70564591b854bbd8b7fb4ddd20582e0',
  apiKey: 'sk-7f99ba359d6f4c7b98924e1cc71e28d6',
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/apps',
  streamOutput: true
});

// 发送诊断请求
const messages = [
  {
    role: "system",
    content: "你是一位专业的医疗诊断助手，请根据用户描述的症状提供专业的医疗建议。"
  },
  {
    role: "user",
    content: "我最近几天一直感觉头痛和发热，这是怎么回事？"
  }
];

const response = await aiService.sendDiagnosisRequest(messages);
```

## 6. 注意事项

1. API密钥安全：不要将apiKey硬编码在客户端代码中，建议通过后端服务代理
2. 错误处理：实现完善的错误处理机制，包括网络错误、API限流等
3. 会话管理：合理管理session_id，确保对话连贯性
4. 合规性：确保医疗咨询符合相关法规要求

这个方案充分利用了阿里云百炼平台的能力，可以为医疗诊断应用提供强大的AI支持。