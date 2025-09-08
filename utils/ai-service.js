/**
 * 阿里云百炼API服务类
 * 提供与阿里云百炼智能体应用的集成能力
 */
class AliyunBailianService {
  /**
   * 构造函数
   * @param {Object} config - 配置对象
   * @param {string} config.appId - 应用ID
   * @param {string} config.apiKey - API密钥
   * @param {string} config.apiUrl - API基础URL
   * @param {string} config.modelName - 模型名称
   * @param {boolean} config.enableThoughts - 是否启用思考过程
   * @param {boolean} config.streamOutput - 是否启用流式输出
   */
  constructor(config) {
    this.appId = config.appId;
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'https://dashscope.aliyuncs.com/api/v1/apps';
    this.modelName = config.modelName || 'qwen-max';
    this.enableThoughts = config.enableThoughts || false;
    this.streamOutput = config.streamOutput || true;
  }

  /**
   * 构建API请求URL
   * @returns {string} 完整的API请求URL
   */
  getApiUrl() {
    return `${this.apiUrl}/${this.appId}/completion`;
  }

  /**
   * 发送诊断请求到阿里云百炼API（支持流式和普通响应）
   * @param {Array} messages - 对话消息数组
   * @param {string|null} sessionId - 会话ID（可选）
   * @param {Object} options - 其他选项参数
   * @param {Function} onStreamChunk - 流式响应回调函数（可选）
   * @returns {Promise<Object>} API响应结果
   */
  async sendDiagnosisRequest(messages, sessionId = null, options = {}, onStreamChunk = null) {
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
        messages: messages,
        biz_params: options.bizParams || {}
      },
      parameters: {
        incremental_output: this.streamOutput ? 'true' : 'false'
      }
    };
    
    // 如果启用了思考过程，添加相应参数
    if (this.enableThoughts) {
      data.parameters.has_thoughts = 'true';
    }

    // 如果提供了sessionId，添加到请求中
    if (sessionId) {
      data.input.session_id = sessionId;
    }

    try {
      // 如果是流式输出且有回调函数，使用流式请求
      if (this.streamOutput && onStreamChunk) {
        return await this.makeStreamingRequest(url, {
          method: 'POST',
          headers: headers,
          data: data
        }, onStreamChunk);
      } else {
        // 普通请求
        const response = await this.makeRequest(url, {
          method: 'POST',
          headers: headers,
          data: data
        });
        return response;
      }
    } catch (error) {
      console.error('阿里云百炼API调用失败:', error);
      throw new Error(`API调用失败: ${error.message}`);
    }
  }

  /**
   * 执行HTTP请求的通用方法（非流式）
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async makeRequest(url, options) {
    // 在UniApp环境中，使用uni.request
    if (typeof uni !== 'undefined' && uni.request) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: url,
          method: options.method,
          header: options.headers,
          data: options.data,
          success: (res) => {
            // 检查响应状态码
            if (res.statusCode !== 200) {
              reject(new Error(`HTTP错误: ${res.statusCode} ${res.data?.message || '未知错误'}`));
              return;
            }
            // 检查响应是否为空
            if (!res.data) {
              reject(new Error('API响应内容为空'));
              return;
            }
            resolve(res.data);
          },
          fail: (err) => {
            reject(new Error(`网络请求失败: ${err.errMsg}`));
          }
        });
      });
    }
    // 在Node.js环境中，使用https模块
    else if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      const https = require('https');
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestOptions = {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname + urlObj.search,
          method: options.method,
          headers: options.headers
        };

        const req = https.request(requestOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              // 检查响应状态码
              if (res.statusCode !== 200) {
                reject(new Error(`HTTP错误: ${res.statusCode} ${data || '未知错误'}`));
                return;
              }
              // 检查响应是否为空
              if (!data) {
                reject(new Error('API响应内容为空'));
                return;
              }
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(new Error(`响应数据解析失败: ${error.message}`));
            }
          });
        });

        req.on('error', (e) => {
          reject(new Error(`请求失败: ${e.message}`));
        });

        if (options.data) {
          req.write(JSON.stringify(options.data));
        }
        req.end();
      });
    }
    // 在普通浏览器环境中，使用fetch
    else {
      const response = await fetch(url, {
        method: options.method,
        headers: options.headers,
        body: options.data ? JSON.stringify(options.data) : undefined
      });
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // 检查响应是否为空
      if (!data) {
        throw new Error('API响应内容为空');
      }
      return data;
    }
  }

  /**
   * 执行流式HTTP请求（UniApp环境）
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @param {Function} onChunk - 流式数据回调函数
   * @returns {Promise<Object>} 最终响应结果
   */
  async makeStreamingRequest(url, options, onChunk) {
    return new Promise((resolve, reject) => {
      let accumulatedResponse = null;
      let hasContent = false;
      
      // 在UniApp环境中使用uni.request处理流式响应
      if (typeof uni !== 'undefined' && uni.request) {
        uni.request({
          url: url,
          method: options.method,
          header: options.headers,
          data: options.data,
          success: (res) => {
            try {
              // 检查响应状态码
              if (res.statusCode !== 200) {
                reject(new Error(`HTTP错误: ${res.statusCode} ${res.data?.message || '未知错误'}`));
                return;
              }
              
              // 处理响应数据
              let responseData = res.data;
              
              // 检查响应是否为空
              if (!responseData) {
                reject(new Error('API响应内容为空'));
                return;
              }
              
              // 如果响应是字符串且包含SSE格式
              if (typeof responseData === 'string' && responseData.includes('data:')) {
                accumulatedResponse = this.processSSEResponse(responseData, onChunk);
                hasContent = true;
              } 
              // 如果是对象且包含output.text
              else if (responseData && responseData.output && responseData.output.text) {
                accumulatedResponse = responseData;
                // 直接调用回调函数显示完整内容
                onChunk(responseData.output.text, true);
                hasContent = true;
              }
              // 如果是字符串但不包含SSE格式
              else if (typeof responseData === 'string') {
                try {
                  const jsonData = JSON.parse(responseData);
                  if (jsonData.output && jsonData.output.text) {
                    accumulatedResponse = jsonData;
                    onChunk(jsonData.output.text, true);
                    hasContent = true;
                  }
                } catch (parseError) {
                  // JSON解析失败，直接显示
                  onChunk(responseData, true);
                  hasContent = true;
                }
              }
              
              // 如果没有任何内容，抛出错误
              if (!hasContent) {
                reject(new Error('AI回复内容为空'));
                return;
              }
              
              resolve(accumulatedResponse);
            } catch (error) {
              console.error('处理响应数据失败:', error);
              reject(new Error(`处理响应数据失败: ${error.message}`));
            }
          },
          fail: (err) => {
            reject(new Error(`网络请求失败: ${err.errMsg}`));
          }
        });
      } else {
        // 非UniApp环境，使用fetch处理真实的SSE流式响应
        fetch(url, {
          method: options.method,
          headers: options.headers,
          body: options.data ? JSON.stringify(options.data) : undefined
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let hasContent = false;
            
            const processStream = async () => {
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  
                  const chunk = decoder.decode(value, { stream: true });
                  buffer += chunk;
                  
                  // 处理完整的SSE事件
                  const lines = buffer.split('\n');
                  buffer = lines.pop() || ''; // 保留不完整的行
                  
                  for (const line of lines) {
                    if (line.startsWith('data:')) {
                      try {
                        const jsonStr = line.slice(5).trim();
                        if (jsonStr) {
                          const data = JSON.parse(jsonStr);
                          if (data.output && data.output.text) {
                            onChunk(data.output.text, false);
                            accumulatedResponse = data;
                            hasContent = true;
                          }
                        }
                      } catch (parseError) {
                        // 忽略解析错误
                      }
                    }
                  }
                }
                
                // 处理剩余的buffer
                if (buffer) {
                  const lines = buffer.split('\n');
                  for (const line of lines) {
                    if (line.startsWith('data:')) {
                      try {
                        const jsonStr = line.slice(5).trim();
                        if (jsonStr) {
                          const data = JSON.parse(jsonStr);
                          if (data.output && data.output.text) {
                            onChunk(data.output.text, true);
                            accumulatedResponse = data;
                            hasContent = true;
                          }
                        }
                      } catch (parseError) {
                        // 忽略解析错误
                      }
                    }
                  }
                }
                
                // 如果没有任何内容，抛出错误
                if (!hasContent) {
                  throw new Error('AI回复内容为空');
                }
                
                resolve(accumulatedResponse);
              } catch (error) {
                reject(error);
              }
            };
            
            processStream();
          })
          .catch(reject);
      }
    });
  }

  
  /**
   * 处理SSE格式的响应
   * @param {string} responseData - SSE响应数据
   * @param {Function} onChunk - 数据块回调函数
   * @returns {Object} 最后一个有效的响应对象
   */
  processSSEResponse(responseData, onChunk) {
    const lines = responseData.split('\n');
    let accumulatedText = '';
    let lastResponse = null;
    let hasContent = false;
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        try {
          const jsonStr = line.slice(5).trim();
          if (jsonStr) {
            const data = JSON.parse(jsonStr);
            if (data.output && data.output.text) {
              accumulatedText += data.output.text;
              lastResponse = data;
              hasContent = true;
            }
          }
        } catch (parseError) {
          // 忽略解析错误
        }
      }
    }
    
    if (hasContent && accumulatedText) {
      onChunk(accumulatedText, true);
    }
    
    return lastResponse;
  }

  
  /**
   * 处理流式数据块
   * @param {string} chunk - 数据块
   * @param {Function} onChunk - 数据块回调函数
   */
  processStreamChunk(chunk, onChunk) {
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        try {
          const jsonData = JSON.parse(line.slice(5).trim());
          if (jsonData.output && jsonData.output.text) {
            onChunk(jsonData.output.text, false);
          }
        } catch (parseError) {
          // 忽略解析错误
        }
      }
    }
  }

  /**
   * 从消息数组构建提示文本
   * @param {Array} messages - 消息数组
   * @returns {string} 构建好的提示文本
   */
  buildPromptFromMessages(messages) {
    // 阿里云百炼API期望的是messages数组格式，不需要转换为prompt文本
    // 这个方法主要用于兼容其他需要prompt格式的API
    return messages;
  }

  /**
   * 格式化消息数组，确保符合API要求
   * @param {Array} messages - 原始消息数组
   * @returns {Array} 格式化后的消息数组
   */
  formatMessages(messages) {
    return messages.map(msg => {
      // 确保每条消息都有role和content字段
      if (typeof msg === 'string') {
        return {
          role: 'user',
          content: msg
        };
      }
      // 确保role字段是正确的格式
      if (msg.role === 'ai') {
        return {
          ...msg,
          role: 'assistant'
        };
      }
      return msg;
    });
  }

  /**
   * 构造一个标准的医疗对话提示
   * @param {string} userQuestion - 用户问题
   * @returns {Array} 包含系统提示和用户问题的消息数组
   */
  buildMedicalPrompt(userQuestion) {
    return [
      {
        role: "system",
        content: "你是一位专业的医疗诊断助手，请根据用户描述的症状提供专业的医疗建议。请记住：你不能替代医生进行正式诊断，只能提供参考信息和建议用户就医。"
      },
      {
        role: "user",
        content: userQuestion
      }
    ];
  }
}

// 导出服务类（CommonJS）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AliyunBailianService;
}

// 导出服务类（ES6）
if (typeof exports !== 'undefined') {
  exports.default = AliyunBailianService;
}