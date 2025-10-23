<template>
  <view class="container">
    <!-- 顶部Banner -->
    <view class="header">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <view class="header-content">
          <text class="header-title">医疗助手</text>
          <text class="header-subtitle">您的健康管家</text>
        </view>
        <view class="header-decoration"></view>
      </view>
      <!-- 添加装饰性元素 -->
      <view class="header-particles">
        <view class="particle particle-1"></view>
        <view class="particle particle-2"></view>
        <view class="particle particle-3"></view>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="swiper-section">
      <swiper class="swiper" circular autoplay interval="4000" duration="800" indicator-dots indicator-active-color="#667eea">
        <swiper-item v-for="(item, index) in bannerList" :key="index" @click="viewNewsDetail(item)">
          <view class="swiper-item">
            <image :src="item.image" mode="aspectFill" class="swiper-image"></image>
            <view class="swiper-overlay">
              <view class="swiper-content">
                <text class="swiper-title">{{item.title}}</text>
                <text class="swiper-subtitle">点击查看详情</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 功能区 -->
    <view class="function-area">
      <view class="function-item ai-function" @click="navigateTo('/pagesA/ai-doctor/index')">
        <view class="function-icon-wrapper">
          <view class="function-icon ai-icon">
            <image src="/static/icons/ai-icon.png" mode="aspectFit"></image>
          </view>
          <view class="icon-glow ai-glow"></view>
        </view>
        <text class="function-text">AI智能问诊</text>
        <text class="function-desc">专业医疗咨询</text>
      </view>
      <view class="function-item image-function" @click="navigateTo('/pagesA/image-diagnose/index')">
        <view class="function-icon-wrapper">
          <view class="function-icon image-icon">
            <image src="/static/icons/image-icon.png" mode="aspectFit"></image>
          </view>
          <view class="icon-glow image-glow"></view>
        </view>
        <text class="function-text">图像诊断</text>
        <text class="function-desc">MRI智能分析</text>
      </view>
    </view>
    
    <!-- 今日值班医生 -->
    <view class="doctor-section">
      <view class="section-header">
        <view class="section-title-wrapper">
          <text class="section-icon">👨‍⚕️</text>
          <text class="title">今日值班医生</text>
        </view>
        <text class="more" @click="navigateTo('/pages/doctors/index')">全部</text>
      </view>
      <scroll-view scroll-x class="doctor-scroll" show-scrollbar="false">
        <view class="doctor-list">
          <view class="doctor-card" v-for="(doctor, index) in doctorList" :key="index" @click="viewDoctorDetail(doctor)">
            <view class="doctor-avatar-wrapper">
              <image class="doctor-avatar" :src="doctor.avatar" mode="aspectFill"></image>
              <view class="online-status" v-if="doctor.available"></view>
            </view>
            <text class="doctor-name">{{doctor.name}}</text>
            <text class="doctor-title">{{doctor.title}}</text>
            <text class="doctor-dept">{{doctor.department}}</text>
            <view class="consult-btn">咨询</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 健康资讯 -->
    <view class="news-section">
      <view class="section-header">
        <view class="section-title-wrapper">
          <text class="section-icon">📰</text>
          <text class="title">健康资讯</text>
        </view>
        <text class="more" @click="navigateTo('/pages/news/index')">更多</text>
      </view>
      <view class="news-list">
        <view class="news-item" v-for="(item, index) in newsList" :key="index" @click="viewNewsDetail(item)">
          <image class="news-image" :src="item.image" mode="aspectFill"></image>
          <view class="news-content">
            <text class="news-title">{{item.title}}</text>
            <text class="news-desc">{{item.description}}</text>
            <view class="news-meta">
              <view class="news-tag">健康</view>
              <text class="news-time">{{item.time}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [
        {
          id: 1,
          title: '骨关节炎新疗法研究突破',
          image: '/static/images/news1.png',
        },
        {
          id: 2,
          title: '关节炎患者的运动指南',
          image: '/static/images/news2.png',
        },
        {
          id: 3,
          title: '饮食与骨关节炎的关系',
          image: '/static/images/news3.png',
        }
      ],
      doctorList: [
        {
          id: 1,
          name: '王医生',
          title: '主任医师',
          department: '骨科',
          avatar: '/static/images/ai-avatar.png',
          available: true
        },
        {
          id: 2,
          name: '李医生',
          title: '副主任医师',
          department: '内科',
          avatar: '/static/images/user-avatar.png',
          available: true
        },
        {
          id: 3,
          name: '张医生',
          title: '主治医师',
          department: '神经科',
          avatar: '/static/images/default-avatar.png',
          available: true
        },
        {
          id: 4,
          name: '刘医生',
          title: '主任医师',
          department: '康复科',
          avatar: '/static/images/ai-avatar.png',
          available: true
        }
      ],
      newsList: [
        {
          id: 1,
          title: '骨关节炎新疗法研究突破',
          description: '科学家发现可能逆转软骨损伤的再生技术',
          image: '/static/images/news1.png',
          time: '2023-10-18'
        },
        {
          id: 2,
          title: '关节炎患者的运动指南',
          description: '专家推荐的低冲击运动方式帮助缓解症状',
          image: '/static/images/news2.png',
          time: '2023-10-15'
        },
        {
          id: 3,
          title: '饮食与骨关节炎的关系',
          description: '最新研究揭示某些食物可能加重或缓解关节炎症状',
          image: '/static/images/news3.png',
          time: '2023-10-12'
        }
      ],
      statusBarHeight: 20 // 默认值
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    viewNewsDetail(item) {
      uni.navigateTo({
        url: `/pages/news/detail?id=${item.id}`
      });
    },
    viewDoctorDetail(doctor) {
      uni.navigateTo({
        url: `/pages/doctors/detail?id=${doctor.id}`
      });
    }
  }
}
</script>

<style>
.container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  position: relative;
  padding-bottom: 30rpx;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 顶部Banner优化 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 240rpx;
  padding-top: 44rpx;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

/* 移除复杂动画 */

.nav-bar {
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header-title {
  font-size: 48rpx;
  font-weight: bold;
  text-shadow: 0 4rpx 12rpx rgba(0,0,0,0.3);
  margin-bottom: 8rpx;
  letter-spacing: 2rpx;
}

.header-subtitle {
  font-size: 26rpx;
  opacity: 0.9;
  text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.2);
  font-weight: 300;
}

.header-decoration {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 8rpx;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
  border-radius: 4rpx;
  animation: decorationPulse 3s ease-in-out infinite;
}

@keyframes decorationPulse {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 1; transform: translateX(-50%) scaleX(1.2); }
}

/* 装饰性粒子 - 简化版 */
.header-particles {
  display: none;
}

/* 轮播图优化 */
.swiper-section {
  padding: 30rpx 30rpx 20rpx;
  position: relative;
}

.swiper {
  height: 360rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 48rpx rgba(102, 126, 234, 0.2);
  transform: translateZ(0);
  transition: all 0.3s ease;
}

.swiper:hover {
  transform: translateY(-4rpx) scale(1.02);
  box-shadow: 0 16rpx 64rpx rgba(102, 126, 234, 0.3);
}

.swiper-item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.swiper-image {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.swiper-item:hover .swiper-image {
  transform: scale(1.05);
}

.swiper-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4), transparent);
  color: #fff;
  padding: 40rpx 30rpx;
  backdrop-filter: blur(10rpx);
}

.swiper-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.swiper-title {
  font-size: 34rpx;
  font-weight: bold;
  line-height: 1.4;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.5);
}

.swiper-subtitle {
  font-size: 24rpx;
  opacity: 0.8;
  font-weight: 300;
}

/* 功能区优化 */
.function-area {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx 40rpx;
  gap: 24rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 28rpx;
  padding: 50rpx 20rpx;
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.function-item:hover {
  transform: translateY(-8rpx) scale(1.02);
  box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.25);
}

.function-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 28rpx 28rpx 0 0;
}

.ai-function::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.image-function::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.function-icon-wrapper {
  position: relative;
  margin-bottom: 24rpx;
}

.function-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.function-item:hover .function-icon {
  transform: scale(1.1) rotate(5deg);
}

.function-icon image {
  width: 80rpx;
  height: 80rpx;
  filter: drop-shadow(0 4rpx 12rpx rgba(0,0,0,0.2));
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  opacity: 0.2;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.05; }
}

.ai-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.ai-glow {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.image-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.image-glow {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.function-text {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 12rpx;
  text-align: center;
}

.function-desc {
  font-size: 24rpx;
  color: #666;
  text-align: center;
  opacity: 0.8;
}

/* 医生区域优化 */
.doctor-section, .news-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  margin: 0 30rpx 30rpx;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.doctor-section:hover, .news-section:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 48rpx rgba(102, 126, 234, 0.18);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid rgba(102, 126, 234, 0.1);
}

.section-title-wrapper {
  display: flex;
  align-items: center;
}

.section-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.1));
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  letter-spacing: 1rpx;
}

.more {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 500;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.more:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.doctor-scroll {
  width: 100%;
  white-space: nowrap;
}

.doctor-list {
  display: flex;
  padding: 10rpx 0;
}

.doctor-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 220rpx;
  margin-right: 30rpx;
  background: linear-gradient(145deg, rgba(248, 249, 255, 0.9), rgba(232, 240, 255, 0.9));
  backdrop-filter: blur(10rpx);
  border-radius: 24rpx;
  padding: 35rpx 20rpx;
  box-shadow: 0 6rpx 24rpx rgba(102, 126, 234, 0.15);
  border: 2rpx solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.doctor-card:hover {
  transform: translateY(-4rpx) scale(1.02);
  box-shadow: 0 12rpx 36rpx rgba(102, 126, 234, 0.25);
}

.doctor-avatar-wrapper {
  position: relative;
  margin-bottom: 20rpx;
}

.doctor-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  border: 4rpx solid #667eea;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.2);
  transition: transform 0.3s ease;
}

.doctor-card:hover .doctor-avatar {
  transform: scale(1.05);
}

.online-status {
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  width: 24rpx;
  height: 24rpx;
  background: #4CAF50;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.doctor-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.doctor-title {
  font-size: 24rpx;
  color: #667eea;
  margin-bottom: 4rpx;
}

.doctor-dept {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.consult-btn {
  font-size: 24rpx;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 14rpx 28rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.consult-btn:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
}

/* 资讯区域优化 */
.news-item {
  display: flex;
  padding: 30rpx 20rpx;
  border-bottom: 2rpx solid rgba(102, 126, 234, 0.05);
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10rpx);
}

.news-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(8rpx) scale(1.01);
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.1);
}

.news-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.news-image {
  width: 220rpx;
  height: 160rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.news-item:hover .news-image {
  transform: scale(1.05);
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
  font-weight: 500;
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.2);
}

.news-time {
  font-size: 22rpx;
  color: #999;
  font-weight: 400;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .function-area {
    flex-direction: column;
    gap: 20rpx;
  }

  .function-item {
    width: 100%;
  }

  .doctor-card {
    width: 180rpx;
  }

  .news-image {
    width: 180rpx;
    height: 120rpx;
  }
}

/* 全局动画优化 */
view, text, image, button {
  -webkit-tap-highlight-color: transparent;
}

.container > view {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为不同元素添加延迟动画 */
.header {
  animation-delay: 0s;
}

.swiper-section {
  animation-delay: 0.1s;
}

.function-area {
  animation-delay: 0.2s;
}

.doctor-section {
  animation-delay: 0.3s;
}

.news-section {
  animation-delay: 0.4s;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6rpx;
  height: 6rpx;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2, #667eea);
}
</style>
