import { AI_CONFIG, CURRENT_CONFIG } from '../config/ai-config.js';

class AIService {
  constructor() {
    this.config = AI_CONFIG[CURRENT_CONFIG];
    this.commonConfig = AI_CONFIG.common;
  }

  // 主要的AI调用方法
  async chat(message, conversationHistory = []) {
    try {
      switch (CURRENT_CONFIG) {
        case 'openai_compatible':
          return await this.callOpenAICompatible(message, conversationHistory);
        case 'custom_api':
          return await this.callCustomAPI(message, conversationHistory);
        case 'websocket':
          return await this.callWebSocket(message);
        case 'local_model':
          return await this.callLocalModel(message, conversationHistory);
        default:
          throw new Error('未配置AI服务');
      }
    } catch (error) {
      console.error('AI调用失败:', error);
      throw error;
    }
  }

  // OpenAI兼容API调用
  async callOpenAICompatible(message, history) {
    const messages = [
      {
        role: 'system',
        content: this.commonConfig.systemPrompt
      },
      ...history.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await uni.request({
      url: this.config.apiUrl,
      method: 'POST',
      header: this.config.headers,
      data: {
        model: this.config.model,
        messages: messages,
        max_tokens: this.commonConfig.maxTokens,
        temperature: this.commonConfig.temperature
      },
      timeout: this.commonConfig.timeout
    });

    if (response.statusCode === 200) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error(`API调用失败: ${response.statusCode}`);
    }
  }

  // 自定义API调用
  async callCustomAPI(message, history) {
    let requestData;
    
    if (this.config.formatRequest) {
      requestData = this.config.formatRequest(message, history);
    } else {
      requestData = {
        message: message,
        history: history
      };
    }

    const response = await uni.request({
      url: this.config.apiUrl,
      method: 'POST',
      header: this.config.headers,
      data: requestData,
      timeout: this.commonConfig.timeout
    });

    if (response.statusCode === 200) {
      if (this.config.parseResponse) {
        return this.config.parseResponse(response);
      } else {
        return response.data.response || response.data.answer;
      }
    } else {
      throw new Error(`API调用失败: ${response.statusCode}`);
    }
  }

  // WebSocket调用 (需要在页面中实现WebSocket连接)
  async callWebSocket(message) {
    return new Promise((resolve, reject) => {
      const ws = uni.connectSocket({
        url: this.config.wsUrl,
        header: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      ws.onOpen(() => {
        ws.send({
          data: JSON.stringify({
            message: message,
            type: 'chat'
          })
        });
      });

      ws.onMessage((res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.type === 'response') {
            resolve(data.content);
            ws.close();
          }
        } catch (error) {
          reject(error);
        }
      });

      ws.onError((error) => {
        reject(error);
      });

      // 设置超时
      setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket连接超时'));
      }, this.commonConfig.timeout);
    });
  }

  // 本地模型调用
  async callLocalModel(message, history) {
    const response = await uni.request({
      url: this.config.apiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        prompt: message,
        history: history,
        max_length: this.commonConfig.maxTokens,
        temperature: this.commonConfig.temperature
      },
      timeout: this.config.timeout || this.commonConfig.timeout
    });

    if (response.statusCode === 200) {
      return response.data.response;
    } else {
      throw new Error(`本地模型调用失败: ${response.statusCode}`);
    }
  }

  // 重试机制
  async chatWithRetry(message, conversationHistory = []) {
    let lastError;
    
    for (let i = 0; i < this.commonConfig.retryTimes; i++) {
      try {
        return await this.chat(message, conversationHistory);
      } catch (error) {
        lastError = error;
        console.warn(`AI调用失败，第${i + 1}次重试:`, error);
        
        // 等待一段时间后重试
        if (i < this.commonConfig.retryTimes - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }
}

export default new AIService();
