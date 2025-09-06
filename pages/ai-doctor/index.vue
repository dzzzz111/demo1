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
            <view class="message-content user-content">
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
            <view class="message-content ai-content">
              <text>{{ message.content }}</text>
              <view class="message-time">{{ message.time }}</view>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-message" v-if="isLoading">
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
            @confirm="sendMessage"
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
// import AIService from '../../utils/ai-service.js';

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
      scrollTop: 0
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;

    // 初始化聊天
    this.scrollToBottom();
  },
  methods: {
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
        // 调用您的大模型API
        const aiResponse = await this.callAIModel(userMessage);

        // 添加AI回复
        this.messageList.push({
          type: 'ai',
          content: aiResponse,
          time: this.getCurrentTime()
        });

      } catch (error) {
        console.error('AI调用失败:', error);
        this.messageList.push({
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
          time: this.getCurrentTime()
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },

    // 调用大模型API
    async callAIModel(message) {
      // 获取对话历史（最近5轮对话）
      const conversationHistory = this.messageList
        .slice(-10) // 取最近10条消息（5轮对话）
        .filter(msg => msg.type !== 'system');

      // 临时模拟AI回复，实际项目中替换为真实AI服务调用
      // return await AIService.chatWithRetry(message, conversationHistory);
      
      // 模拟AI回复
      const responses = [
        '根据您描述的症状，建议您注意休息，多喝水。如果症状持续，请及时就医。',
        '这种情况可能是由多种原因引起的，建议您保持良好的作息习惯，如有不适请咨询专业医生。',
        '感谢您的咨询，根据您的描述，建议您先观察症状变化，必要时到医院进行检查。',
        '您提到的症状需要进一步观察，建议您记录症状变化情况，如有加重请及时就医。'
      ];
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      return responses[Math.floor(Math.random() * responses.length)];
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
  margin-top: 8rpx;
  text-align: right;
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
}
</style> 