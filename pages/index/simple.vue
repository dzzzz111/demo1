<template>
  <view class="simple-container">
    <view class="simple-header">
      <text class="simple-title">医疗助手</text>
      <text class="simple-subtitle">您的健康管家</text>
    </view>
    
    <view class="simple-content">
      <view class="welcome-card">
        <text class="welcome-title">欢迎使用医疗助手</text>
        <text class="welcome-desc">为您提供专业的医疗服务</text>
      </view>
      
      <view class="function-buttons">
        <view class="btn-item" @click="navigateTo('/pages/ai-doctor/index')">
          <text class="btn-text">AI智能问诊</text>
          <text class="btn-desc">专业医疗咨询</text>
        </view>
        
        <view class="btn-item" @click="navigateTo('/pages/image-diagnose/index')">
          <text class="btn-text">图像诊断</text>
          <text class="btn-desc">MRI智能分析</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: '医疗助手已加载'
    };
  },
  onLoad() {
    console.log('简化首页加载成功');
    uni.showToast({
      title: '页面加载成功',
      icon: 'success'
    });
  },
  methods: {
    navigateTo(url) {
      console.log('导航到:', url);
      uni.navigateTo({
        url: url,
        fail: (err) => {
          console.error('导航失败:', err);
          uni.showToast({
            title: '页面开发中',
            icon: 'none'
          });
        }
      });
    }
  }
}
</script>

<style>
.simple-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20rpx;
}

.simple-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 60rpx 40rpx;
  border-radius: 16rpx;
  text-align: center;
  margin-bottom: 40rpx;
}

.simple-title {
  color: #fff;
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.simple-subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 28rpx;
  display: block;
}

.simple-content {
  padding: 0 20rpx;
}

.welcome-card {
  background: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  text-align: center;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.welcome-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.welcome-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.function-buttons {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.btn-item {
  background: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  border-left: 8rpx solid #667eea;
}

.btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
}

.btn-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.btn-item:active {
  background: #f8f9fa;
  transform: scale(0.98);
}
</style>
