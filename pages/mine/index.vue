<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <text class="header-title">个人中心</text>
      </view>
    </view>
    
    <!-- 未登录状态 -->
    <view class="user-section not-login" v-if="!isLogin">
      <view class="avatar">
        <image src="/static/images/default-avatar.png"></image>
      </view>
      <view class="login-action">
        <view class="login-btn" @click="navigateTo('/pages/mine/login')">登录 / 注册</view>
        <text class="hint-text">登录后享受更多健康服务</text>
      </view>
    </view>
    
    <!-- 已登录状态 -->
    <view class="user-section is-login" v-else>
      <view class="user-info">
        <view class="avatar">
          <image :src="userInfo.avatar || '/static/images/default-avatar.png'"></image>
        </view>
        <view class="info">
          <view class="name">{{ userInfo.name }}</view>
          <view class="desc">{{ userInfo.tagline || '暂无个性签名' }}</view>
        </view>
      </view>
      <view class="vip-card" v-if="userInfo.vipLevel > 0">
        <view class="vip-type">{{ vipLevelText }}</view>
        <view class="vip-date">有效期至：{{ userInfo.vipEndDate }}</view>
      </view>
    </view>
    
    <!-- 健康数据卡片 -->
    <view class="health-data" v-if="isLogin">
      <view class="card-title">
        <text>我的健康</text>
        <text class="title-tag">本周</text>
      </view>
      <view class="data-grid">
        <view class="data-item">
          <view class="data-value">{{ healthData.steps }}</view>
          <view class="data-label">步数</view>
        </view>
        <view class="data-item">
          <view class="data-value">{{ healthData.sleepHours }}h</view>
          <view class="data-label">睡眠</view>
        </view>
        <view class="data-item">
          <view class="data-value">{{ healthData.heartRate }}次/分</view>
          <view class="data-label">心率</view>
        </view>
        <view class="data-item">
          <view class="data-value">{{ healthData.bloodPressure }}</view>
          <view class="data-label">血压</view>
        </view>
      </view>
    </view>
    
    <!-- 功能列表 -->
    <view class="feature-list">
      <!-- 健康档案，登录可见 -->
      <view class="feature-group" v-if="isLogin">
        <view class="group-title">健康档案</view>
        <view class="feature-item" @click="navigateTo('/pages/mine/medical-record')">
          <view class="item-icon medical-record">
            <text class="iconfont icon-record"></text>
          </view>
          <view class="item-content">
            <text class="item-name">病历记录</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="feature-item" @click="navigateTo('/pages/mine/examination')">
          <view class="item-icon examination">
            <text class="iconfont icon-exam"></text>
          </view>
          <view class="item-content">
            <text class="item-name">体检报告</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="feature-item" @click="navigateTo('/pages/mine/medication')">
          <view class="item-icon medication">
            <text class="iconfont icon-medicine"></text>
          </view>
          <view class="item-content">
            <text class="item-name">用药记录</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
      
      <!-- 服务记录 -->
      <view class="feature-group">
        <view class="group-title">服务记录</view>
        <view class="feature-item" @click="navigateTo('/pages/ai-doctor/history')">
          <view class="item-icon ai-history">
            <text class="iconfont icon-chat-history"></text>
          </view>
          <view class="item-content">
            <text class="item-name">问诊记录</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="feature-item" @click="navigateTo('/pages/image-diagnose/history')">
          <view class="item-icon image-history">
            <text class="iconfont icon-image-history"></text>
          </view>
          <view class="item-content">
            <text class="item-name">图像诊断记录</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
      
      <!-- 系统设置 -->
      <view class="feature-group">
        <view class="group-title">系统设置</view>
        <view class="feature-item" @click="navigateTo('/pages/mine/settings')">
          <view class="item-icon settings">
            <text class="iconfont icon-settings"></text>
          </view>
          <view class="item-content">
            <text class="item-name">设置</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="feature-item" @click="navigateTo('/pages/mine/about')">
          <view class="item-icon about">
            <text class="iconfont icon-about"></text>
          </view>
          <view class="item-content">
            <text class="item-name">关于我们</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="feature-item" @click="navigateTo('/pages/mine/feedback')">
          <view class="item-icon feedback">
            <text class="iconfont icon-feedback"></text>
          </view>
          <view class="item-content">
            <text class="item-name">意见反馈</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
        <view class="feature-item" v-if="isLogin" @click="logout">
          <view class="item-icon logout">
            <text class="iconfont icon-logout"></text>
          </view>
          <view class="item-content">
            <text class="item-name">退出登录</text>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
    </view>
    
    <!-- 底部版本信息 -->
    <view class="footer">
      <text>医疗助手 v1.0.0</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      userInfo: {
        name: '张三',
        avatar: '',
        tagline: '健康生活，从我做起',
        vipLevel: 1,
        vipEndDate: '2023-12-31'
      },
      healthData: {
        steps: '8,432',
        sleepHours: '7.5',
        heartRate: '72',
        bloodPressure: '120/80'
      },
      statusBarHeight: 20 // 默认值
    };
  },
  computed: {
    vipLevelText() {
      const levelMap = {
        1: '普通会员',
        2: '高级会员',
        3: 'VIP会员'
      };
      return levelMap[this.userInfo.vipLevel] || '普通会员';
    }
  },
  onShow() {
    // 检查登录状态，实际项目中应该从缓存或状态管理中获取
    this.checkLoginStatus();
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    
    // 检查登录状态
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      // 模拟检查登录状态，实际项目中应调用API或检查本地存储
      const token = uni.getStorageSync('token');
      this.isLogin = !!token;
      
      // 如果已登录，获取用户信息
      if (this.isLogin) {
        this.getUserInfo();
      }
    },
    getUserInfo() {
      // 从本地存储获取用户信息
      const userInfoStr = uni.getStorageSync('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          this.userInfo = userInfo;
        } catch (e) {
          console.error('Parse userInfo error:', e);
        }
      }
    },
    navigateTo(url) {
      // 检查页面是否存在
      const existingPages = ['/pages/mine/login'];
      
      if (existingPages.includes(url)) {
        uni.navigateTo({
          url: url
        });
      } else {
        // 对于不存在的页面，显示提示
        uni.showToast({
          title: '功能开发中',
          icon: 'none',
          duration: 2000
        });
      }
    },
    logout() {
      // 退出登录逻辑
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除登录信息
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
            
            // 更新状态
            this.isLogin = false;
            
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            });
          }
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
}

/* 顶部标题 */
.header {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  height: 204rpx;
  padding-top: 44rpx;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
}

.status-bar {
  height: 44rpx;
  width: 100%;
}

.nav-bar {
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
}

.placeholder {
  width: 60rpx;
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

/* 用户信息区域 */
.user-section {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  padding: 30rpx;
  color: #fff;
}

.user-section.not-login {
  display: flex;
  align-items: center;
  padding-bottom: 60rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fff;
  margin-right: 30rpx;
}

.avatar image {
  width: 100%;
  height: 100%;
}

.login-action {
  flex: 1;
}

.login-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 28rpx;
  width: 240rpx;
  margin-bottom: 10rpx;
}

.hint-text {
  font-size: 24rpx;
  opacity: 0.8;
}

.user-section.is-login {
  padding-bottom: 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.info {
  flex: 1;
}

.name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.desc {
  font-size: 24rpx;
  opacity: 0.8;
}

.vip-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-type {
  font-size: 28rpx;
  font-weight: 500;
}

.vip-date {
  font-size: 24rpx;
  opacity: 0.8;
}

/* 健康数据卡片 */
.health-data {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
}

.title-tag {
  font-size: 22rpx;
  color: #3a7bd5;
  background-color: rgba(58, 123, 213, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-left: 20rpx;
  font-weight: normal;
}

.data-grid {
  display: flex;
  flex-wrap: wrap;
}

.data-item {
  width: 50%;
  padding: 20rpx 0;
}

.data-value {
  font-size: 36rpx;
  color: #3a7bd5;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.data-label {
  font-size: 24rpx;
  color: #999;
}

/* 功能列表 */
.feature-list {
  margin: 30rpx;
}

.feature-group {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.group-title {
  font-size: 28rpx;
  color: #999;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.feature-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.item-icon text {
  font-size: 40rpx;
}

.medical-record {
  background-color: rgba(58, 123, 213, 0.1);
  color: #3a7bd5;
}

.examination {
  background-color: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
}

.medication {
  background-color: rgba(107, 71, 193, 0.1);
  color: #6b47c1;
}

.ai-history {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.image-history {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.settings {
  background-color: rgba(158, 158, 158, 0.1);
  color: #9e9e9e;
}

.about {
  background-color: rgba(233, 30, 99, 0.1);
  color: #e91e63;
}

.feedback {
  background-color: rgba(3, 169, 244, 0.1);
  color: #03a9f4;
}

.logout {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.item-content {
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.icon-right {
  color: #ccc;
  font-size: 32rpx;
}

/* 底部版本信息 */
.footer {
  text-align: center;
  padding: 40rpx 0 60rpx;
  color: #999;
  font-size: 24rpx;
}
</style> 