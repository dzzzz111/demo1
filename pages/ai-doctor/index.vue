<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="iconfont icon-back">←</text>
        </view>
        <text class="header-title">AI智能问诊</text>
        <view class="placeholder"></view>
      </view>
    </view>
    
    <!-- 原生聊天界面 -->
    <view class="chat-container">
      <!-- 聊天消息列表 -->
      <scroll-view
        class="message-list"
        scroll-y
        :scroll-top="scrollTop"
        scroll-with-animation
      >
        <view class="message-item" v-for="(message, index) in messageList" :key="index">
          <!-- 用户消息 -->
          <view class="message user-message" v-if="message.type === 'user'">
            <view class="message-content user-content" @longpress="handleLongPress(message.content)">
              <text>{{ message.content }}</text>
            </view>
            <view class="message-avatar user-avatar">
              <image src="/static/images/user-avatar.png" mode="aspectFill"></image>
            </view>
          </view>

          <!-- AI消息 -->
          <view class="message ai-message" v-else>
            <view class="message-avatar ai-avatar">
              <image src="/static/images/ai-avatar.png" mode="aspectFill"></image>
            </view>
            <view class="message-content-wrapper">
              <view class="message-content ai-content" @longpress="handleLongPress(message.content)">
                <text>{{ message.content }}</text>
                <view class="message-footer">
                  <view class="message-time">{{ message.time }}</view>
                  <view class="inline-copy-btn" @click.stop="copyMessage(message.content)">
                    <text class="copy-icon">📋</text>
                  </view>
                </view>
              </view>
              <!-- 选项按钮 -->
              <view class="options-buttons" v-if="message.options && message.options.length > 0">
                <view 
                  class="option-btn" 
                  v-for="(option, optIndex) in message.options" 
                  :key="optIndex"
                  @click="selectOption(option)"
                >
                  <text>{{ option }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 流式响应状态 -->
        <view class="message-item" v-if="isStreaming">
          <view class="message ai-message">
            <view class="message-avatar ai-avatar">
              <image src="/static/images/ai-avatar.png" mode="aspectFill"></image>
            </view>
            <view class="message-content-wrapper">
              <view class="message-content ai-content" @longpress="handleLongPress(streamingMessage)">
                <text>{{ streamingMessage || '对方正在输入中...' }}</text>
                <view class="message-footer">
                  <view class="message-time">{{ getCurrentTime() }}</view>
                  <view class="inline-copy-btn" @click.stop="copyMessage(streamingMessage)" v-if="streamingMessage">
                    <text class="copy-icon">📋</text>
                  </view>
                </view>
              </view>
              <!-- 流式响应的选项按钮 -->
              <view class="options-buttons" v-if="streamingOptions && streamingOptions.length > 0">
                <view 
                  class="option-btn" 
                  v-for="(option, optIndex) in streamingOptions" 
                  :key="optIndex"
                  @click="selectOption(option)"
                >
                  <text>{{ option }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-message" v-if="isLoading && !isStreaming">
          <view class="message-avatar ai-avatar">
            <image src="/static/images/ai-avatar.png" mode="aspectFill"></image>
          </view>
          <view class="loading-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </scroll-view>

      <!-- 输入区域 -->
      <view class="input-area">
        <view class="input-wrapper">
          <textarea
            class="message-input"
            v-model="inputMessage"
            placeholder="请描述您的症状..."
            :maxlength="500"
            auto-height
            @confirm="handleConfirm"
            confirm-type="send"
          ></textarea>
          <view class="input-actions">
            <text class="char-count">{{ inputMessage.length }}/500</text>
            <view
              class="send-btn"
              :class="{ disabled: !inputMessage.trim() || isLoading }"
              @click="sendMessage"
            >
              <text>发送</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import AliyunBailianService from '../../utils/ai-service.js';
import { getCurrentConfig } from '../../config/ai-config.js';

export default {
  data() {
    return {
      statusBarHeight: 20,
      messageList: [
        {
          type: 'ai',
          content: '您好！我是您的AI医疗助手，请描述您的症状，我会为您提供专业的医疗建议。',
          time: this.getCurrentTime()
        }
      ],
      inputMessage: '',
      isLoading: false,
      scrollTop: 0,
      aiService: null,
      streamingMessage: '',
      isStreaming: false,
      streamingOptions: []
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;

    // 初始化AI服务
    try {
      const config = getCurrentConfig();
      this.aiService = new AliyunBailianService(config);
      console.log('AI服务初始化成功');
    } catch (error) {
      console.error('AI服务初始化失败:', error);
    }

    // 初始化聊天
    this.scrollToBottom();
  },
  methods: {
    // 处理确认事件（回车键发送）
    handleConfirm() {
      if (this.inputMessage.trim()) {
        this.sendMessage();
      }
    },

    // 发送消息
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) return;

      const userMessage = this.inputMessage.trim();
      this.inputMessage = '';

      // 添加用户消息
      this.messageList.push({
        type: 'user',
        content: userMessage,
        time: this.getCurrentTime()
      });

      this.scrollToBottom();
      this.isLoading = true;

      try {
        // 调用AI模型API（支持流式响应）
        await this.callAIModelWithStreaming(userMessage);

      } catch (error) {
        console.error('AI调用失败:', error);
        this.messageList.push({
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
          time: this.getCurrentTime(),
          options: []
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },

    // 调用大模型API（支持流式响应）
    async callAIModelWithStreaming(message) {
      if (!this.aiService) {
        throw new Error('AI服务未初始化');
      }

      try {
        // 构建消息历史
        const messages = this.messageList
          .filter(msg => msg.type !== 'system')
          .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

        // 添加当前用户消息
        messages.push({
          role: 'user',
          content: message
        });

        // 初始化流式响应状态
        this.streamingMessage = '';
        this.isStreaming = true;

        // 定义流式响应回调函数
        const onStreamChunk = (chunk, isComplete) => {
          this.streamingMessage = chunk;
          
          // 解析选项
          if (chunk) {
            this.streamingOptions = this.parseOptionsFromContent(chunk);
          }
          
          // 如果是完整的响应，添加到消息列表
          if (isComplete) {
            const options = this.parseOptionsFromContent(chunk);
            this.messageList.push({
              type: 'ai',
              content: chunk,
              time: this.getCurrentTime(),
              options: options
            });
            this.isStreaming = false;
            this.streamingMessage = '';
            this.streamingOptions = [];
          }
          
          // 自动滚动到底部
          this.scrollToBottom();
        };

        // 调用AI服务（启用流式响应）
        const response = await this.aiService.sendDiagnosisRequest(
          messages, 
          null, 
          {}, 
          onStreamChunk
        );
        
        // 如果流式响应没有完成，确保添加到消息列表
        if (this.isStreaming && this.streamingMessage) {
          const options = this.parseOptionsFromContent(this.streamingMessage);
          this.messageList.push({
            type: 'ai',
            content: this.streamingMessage,
            time: this.getCurrentTime(),
            options: options
          });
          this.isStreaming = false;
          this.streamingMessage = '';
          this.streamingOptions = [];
        }
        
        // 返回完整的AI回复
        if (response && response.output && response.output.text) {
          return response.output.text;
        } else if (this.streamingMessage) {
          // 如果流式消息有内容，返回流式消息
          return this.streamingMessage;
        } else {
          throw new Error('AI回复内容为空');
        }
      } catch (error) {
        console.error('AI调用失败:', error);
        this.isStreaming = false;
        this.streamingMessage = '';
        throw error;
      }
    },

    // 调用大模型API（原始方法，保留作为备选）
    async callAIModel(message) {
      if (!this.aiService) {
        throw new Error('AI服务未初始化');
      }

      try {
        // 构建消息历史
        const messages = this.messageList
          .filter(msg => msg.type !== 'system')
          .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

        // 添加当前用户消息
        messages.push({
          role: 'user',
          content: message
        });

        // 调用AI服务
        const response = await this.aiService.sendDiagnosisRequest(messages);
        
        // 返回AI回复
        if (response && response.output && response.output.text) {
          return response.output.text;
        } else {
          throw new Error('AI回复内容为空');
        }
      } catch (error) {
        console.error('AI调用失败:', error);
        throw error;
      }
    },

    // 获取当前时间
    getCurrentTime() {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },

    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 999999;
      });
    },

    // 处理长按事件
    handleLongPress(content) {
      if (!content || !content.trim()) {
        uni.showToast({
          title: '复制内容为空',
          icon: 'none'
        });
        return;
      }

      // 添加震动反馈（如果设备支持）
      uni.vibrateShort({
        type: 'light',
        success: () => {
          console.log('震动反馈成功');
        },
        fail: () => {
          console.log('设备不支持震动反馈');
        }
      });

      uni.setClipboardData({
        data: content,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1500
          });
        },
        fail: (err) => {
          console.error('复制失败:', err);
          uni.showToast({
            title: '复制失败，请重试',
            icon: 'none'
          });
        }
      });
    },

    // 复制消息内容
    copyMessage(content) {
      if (!content || !content.trim()) {
        uni.showToast({
          title: '复制内容为空',
          icon: 'none'
        });
        return;
      }

      uni.setClipboardData({
        data: content,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: (err) => {
          console.error('复制失败:', err);
          uni.showToast({
            title: '复制失败，请重试',
            icon: 'none'
          });
        }
      });
    },

    // 选择选项按钮
    selectOption(option) {
      this.inputMessage = option;
      this.sendMessage();
    },

    // 解析AI回复中的选项
    parseOptionsFromContent(content) {
      const options = [];
      
      // 1. 如果是确认信息（包含"请问您是否确定以上信息"），不解析选项
      if (content.includes('请问您是否确定以上信息') || content.includes('参数信息输出')) {
        return options;
      }
      
      // 2. 如果是参数总结信息（包含大量"用户XX："格式），不解析选项
      const userParamCount = (content.match(/用户[^：]+：/g) || []).length;
      if (userParamCount > 3) {
        return options;
      }
      
      // 3. 如果是判断结果信息（包含"用户是否可能患有骨关节炎"等），不解析选项
      if (content.includes('用户是否可能患有骨关节炎') || 
          content.includes('用户可能的关节炎部位') || 
          content.includes('用户可能的骨关节炎临床分期') ||
          content.includes('接下来是否开始为您制定')) {
        return options;
      }
      
      // 4. 如果是参数总结信息（包含多个|分隔的参数），不解析选项
      const paramCount = (content.match(/\|/g) || []).length;
      if (paramCount > 5) {
        return options;
      }
      
      // 5. 如果包含大量逗号分隔的参数（可能是参数总结），不解析选项
      const commaCount = (content.match(/，/g) || []).length;
      if (commaCount > 10) {
        return options;
      }
      
      // 6. 如果是AI的总结性陈述（包含"根据以上信息"等），不解析选项
      if (content.includes('根据以上信息') || 
          content.includes('根据您提供的信息') ||
          content.includes('接下来是否开始') ||
          content.includes('是否开始为您')) {
        return options;
      }
      
      // 匹配 【选项1、选项2】格式的选项
      const bracketMatch = content.match(/【([^】]+)】/);
      if (bracketMatch) {
        const optionsText = bracketMatch[1];
        // 过滤掉包含|的选项（避免解析参数列表）
        const optionList = optionsText.split('、').map(opt => opt.trim()).filter(opt => 
          !opt.includes('|') && 
          !opt.includes('用户') &&
          !opt.includes('参数') &&
          !opt.includes('：') &&
          opt.length < 15
        );
        if (optionList.length > 0 && optionList.length <= 6) {
          options.push(...optionList);
        }
      }
      
      // 匹配 [选项1、选项2] 格式的选项（使用方括号）
      const squareBracketMatch = content.match(/\[([^\]]+)\]/);
      if (squareBracketMatch) {
        const optionsText = squareBracketMatch[1];
        // 过滤掉包含|的选项
        const optionList = optionsText.split('、').map(opt => opt.trim()).filter(opt => 
          !opt.includes('|') && 
          !opt.includes('用户') &&
          !opt.includes('参数') &&
          !opt.includes('：') &&
          opt.length < 15
        );
        if (optionList.length > 0 && optionList.length <= 6) {
          options.push(...optionList);
        }
      }
      
      // 匹配 选项1|选项2|选项3 格式的选项（只有在选项数量合理且不含复杂参数时）
      const pipeMatch = content.match(/([^\|]+)\|([^\|]+)(?:\|([^\|]+))*/);
      if (pipeMatch && paramCount <= 5) {
        const allOptions = content.match(/([^|\n]+)/g);
        if (allOptions && allOptions.length > 1 && allOptions.length <= 6) {
          const filteredOptions = allOptions.map(opt => opt.trim()).filter(opt => 
            opt.length > 0 && 
            !opt.includes('参数') && 
            !opt.includes('信息') &&
            !opt.includes('以下') &&
            !opt.includes('用户') &&
            !opt.includes('：') &&
            opt.length < 20 // 选项文本长度限制
          );
          if (filteredOptions.length > 0) {
            options.push(...filteredOptions);
          }
        }
      }
      
      return options;
    },

    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }
  }
}
</script>

<style>
.container {
  background-color: #f5f7fa;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 顶部标题 */
.header {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.status-bar {
  height: 44rpx;
  width: 100%;
}

.nav-bar {
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  position: relative;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn text {
  color: #fff;
  font-size: 36rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #fff;
  flex: 1;
  text-align: center;
}

.placeholder {
  width: 60rpx;
}

/* 聊天容器 */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 134rpx);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 消息列表 */
.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.message-item {
  margin-bottom: 30rpx;
}

.message {
  display: flex;
  align-items: flex-end;
  max-width: 80%;
}

/* 用户消息 */
.user-message {
  justify-content: flex-end;
  margin-left: auto;
}

.user-content {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  margin-right: 20rpx;
  order: 1;
}

.user-avatar {
  order: 2;
}

/* AI消息 */
.ai-message {
  justify-content: flex-start;
}

.ai-content {
  background: #fff;
  color: #333;
  margin-left: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.message-content {
  padding: 24rpx 30rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  min-height: 60rpx;
  transition: all 0.2s ease;
  user-select: none;
}

.message-content:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar image {
  width: 100%;
  height: 100%;
}

.message-time {
  font-size: 22rpx;
  color: #999;
  text-align: left;
}

/* 消息底部区域 */
.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8rpx;
  padding-top: 8rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

/* 内联复制按钮 */
.inline-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  opacity: 0.7;
}

.inline-copy-btn:active {
  transform: scale(0.9);
  background: rgba(102, 126, 234, 0.2);
}

.inline-copy-btn:hover {
  opacity: 1;
  background: rgba(102, 126, 234, 0.15);
}

.copy-icon {
  font-size: 20rpx;
  color: #667eea;
}


/* 加载动画 */
.loading-message {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.loading-dots {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #fff;
  border-radius: 24rpx;
  margin-left: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #667eea;
  margin: 0 6rpx;
  animation: loadingDot 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes loadingDot {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.input-area {
  background: #fff;
  padding: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  background: #f8f9fa;
  border-radius: 24rpx;
  padding: 20rpx;
  border: 2rpx solid #e9ecef;
  transition: border-color 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #667eea;
}

.message-input {
  width: 100%;
  min-height: 80rpx;
  max-height: 200rpx;
  font-size: 28rpx;
  line-height: 1.5;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #333;
}

.message-input::placeholder {
  color: #999;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.char-count {
  font-size: 24rpx;
  color: #999;
}

.send-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 16rpx 32rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.send-btn:active {
  transform: scale(0.95);
}

.send-btn.disabled {
  background: #ccc;
  box-shadow: none;
  opacity: 0.6;
}

/* 消息内容包装器 */
.message-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 选项按钮 */
.options-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 8rpx;
}

.option-btn {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  padding: 16rpx 24rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  border: 2rpx solid #dee2e6;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.option-btn:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-color: #667eea;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.option-btn:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  border-color: #adb5bd;
}

/* 选项按钮文字 */
.option-btn text {
  font-weight: 500;
  white-space: nowrap;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .message {
    max-width: 90%;
  }

  .message-content {
    padding: 20rpx 24rpx;
    font-size: 26rpx;
  }

  .message-avatar {
    width: 70rpx;
    height: 70rpx;
  }

  .option-btn {
    padding: 14rpx 20rpx;
    font-size: 24rpx;
    border-radius: 18rpx;
  }
}
</style> 