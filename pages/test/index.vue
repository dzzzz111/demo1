<template>
  <view class="test-container">
    <view class="test-header">
      <text class="test-title">测试页面</text>
    </view>
    <view class="test-content">
      <text class="test-text">如果你能看到这个页面，说明 uni-app 基本功能正常！</text>
      <view class="test-info">
        <text>系统信息：</text>
        <text>平台：{{ platform }}</text>
        <text>屏幕宽度：{{ screenWidth }}px</text>
        <text>屏幕高度：{{ screenHeight }}px</text>
      </view>
      <button class="test-btn" @click="testClick">点击测试</button>
      <text class="test-result" v-if="clicked">按钮点击正常！</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      platform: '',
      screenWidth: 0,
      screenHeight: 0,
      clicked: false
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.platform = systemInfo.platform;
    this.screenWidth = systemInfo.screenWidth;
    this.screenHeight = systemInfo.screenHeight;
    console.log('测试页面加载成功', systemInfo);
  },
  methods: {
    testClick() {
      this.clicked = true;
      uni.showToast({
        title: '测试成功！',
        icon: 'success'
      });
      console.log('按钮点击测试成功');
    }
  }
}
</script>

<style>
.test-container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.test-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 40rpx;
  border-radius: 16rpx;
  margin-bottom: 40rpx;
}

.test-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  display: block;
}

.test-content {
  background: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.test-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.6;
  display: block;
  margin-bottom: 40rpx;
}

.test-info {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 40rpx;
}

.test-info text {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.test-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  padding: 24rpx 48rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  width: 100%;
  margin-bottom: 20rpx;
}

.test-result {
  color: #4CAF50;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  display: block;
}
</style>
