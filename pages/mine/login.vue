<template>
  <view class="container">
    <!-- 顶部安全区域 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="iconfont icon-back">←</text>
    </view>
    
    <!-- 顶部图标和标题 -->
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">医疗助手</text>
      <text class="slogan">您的健康管家，随时守护您的健康</text>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form">
      
      <!-- 密码登录表单 -->
      <view>
        <view class="input-item">
          <text class="iconfont icon-user"></text>
          <input
            type="text"
            v-model="passwordForm.username"
            placeholder="请输入用户名/手机号"
            maxlength="20"
          />
        </view>
        <view class="input-item">
          <text class="iconfont icon-password"></text>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="passwordForm.password"
            placeholder="请输入密码"
            maxlength="20"
          />
          <text
            class="iconfont toggle-password"
            :class="showPassword ? 'icon-eye-open' : 'icon-eye-close'"
            @click="togglePasswordVisibility"
          ></text>
        </view>
      </view>
      
      <!-- 记住密码/忘记密码 -->
      <view class="option-row">
        <view class="remember-pwd" @click="toggleRememberPwd">
          <view class="checkbox" :class="{ checked: rememberPwd }"></view>
          <text>记住密码</text>
        </view>
        <text class="forget-pwd" @click="navigateToForgetPwd">忘记密码？</text>
      </view>
      
      <!-- 登录按钮 -->
      <view class="login-btn" @click="login">登录</view>
      
      <!-- 微信一键登录 -->
      <view class="wechat-login">
        <view class="wechat-login-btn" @click="wechatLogin">
          <text class="wechat-icon">🟢</text>
          <text>微信一键登录</text>
        </view>
      </view>

      <!-- 其他登录方式 -->
      <view class="other-login">
        <view class="divider">
          <view class="line"></view>
          <text>其他登录方式</text>
          <view class="line"></view>
        </view>
        <view class="other-login-icons">
          <view class="icon-item" @click="otherLogin('alipay')">
            <text class="iconfont icon-alipay"></text>
          </view>
        </view>
      </view>
      
      <!-- 注册链接 -->
      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link" @click="navigateToRegister">立即注册</text>
      </view>
    </view>
    
    <!-- 底部协议 -->
    <view class="agreement">
      <view class="agreement-checkbox" @click="toggleAgreement">
        <view class="checkbox" :class="{ checked: agreeProtocol }"></view>
      </view>
      <text class="agreement-text">
        登录即代表您已阅读并同意 
        <text class="link" @click="viewProtocol('user')">《用户协议》</text>
        和
        <text class="link" @click="viewProtocol('privacy')">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      passwordForm: {
        username: '',
        password: ''
      },
      showPassword: false,
      rememberPwd: false,
      agreeProtocol: true,
      statusBarHeight: 20 // 默认值
    };
  },
  onLoad() {
    // 检查是否有记住的密码
    const savedAccount = uni.getStorageSync('remember_account');
    if (savedAccount) {
      this.passwordForm = JSON.parse(savedAccount);
      this.rememberPwd = true;
    }
    
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    // 切换密码显示/隐藏
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    // 切换记住密码
    toggleRememberPwd() {
      this.rememberPwd = !this.rememberPwd;
    },

    // 切换同意协议
    toggleAgreement() {
      this.agreeProtocol = !this.agreeProtocol;
    },

    // 微信一键登录
    wechatLogin() {
      // 检查协议是否同意
      if (!this.agreeProtocol) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }

      // 检查当前运行环境
      const platform = uni.getSystemInfoSync().platform;
      console.log('当前平台:', platform);

      // 检查是否在微信小程序环境中
      const isInWechatMiniProgram = typeof wx !== 'undefined' || platform === 'mp-weixin';

      if (!isInWechatMiniProgram) {
        uni.showToast({
          title: '请在微信小程序中使用',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({
        title: '登录中...'
      });

      // 获取微信登录授权码
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          console.log('微信登录授权码:', loginRes.code);

          if (loginRes.code) {
            // 调用云函数进行微信登录
            this.callWechatLoginCloudFunction(loginRes.code);
          } else {
            uni.hideLoading();
            uni.showToast({
              title: '获取微信授权码失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('微信登录失败:', err);

          uni.showToast({
            title: '微信登录失败，请重试',
            icon: 'none'
          });
        }
      });
    },

    // 调用微信登录云函数
    callWechatLoginCloudFunction(code) {
      uniCloud.callFunction({
        name: 'wechatLogin',
        data: {
          code: code
        },
        success: (res) => {
          uni.hideLoading();
          console.log('云函数响应:', res.result);

          if (res.result.code === 0) {
            this.handleLoginSuccess(res.result);
          } else {
            uni.showToast({
              title: res.result.message || '登录失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('云函数调用失败:', err);

          uni.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      });
    },


    // 处理登录成功
    handleLoginSuccess(result) {
      // 保存token和用户信息
      uni.setStorageSync('token', result.token);
      uni.setStorageSync('userInfo', JSON.stringify(result.userInfo));

      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });

      // 返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    },
    
    // 登录
    login() {
      // 检查协议是否同意
      if (!this.agreeProtocol) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }

      // 密码登录验证
      if (!this.passwordForm.username || !this.passwordForm.password) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        });
        return;
      }

      // 记住密码
      if (this.rememberPwd) {
        uni.setStorageSync('remember_account', JSON.stringify(this.passwordForm));
      } else {
        uni.removeStorageSync('remember_account');
      }

      // 模拟登录请求
      uni.showLoading({
        title: '登录中...'
      });

      setTimeout(() => {
        uni.hideLoading();

        // 验证登录信息
        // 使用本地缓存中的注册信息验证
        const registeredUsers = uni.getStorageSync('registered_users') || [];
        const currentUser = registeredUsers.find(user =>
          user.username === this.passwordForm.username &&
          user.password === this.passwordForm.password
        );

        if (currentUser) {
          // 登录成功，保存token和用户信息
          uni.setStorageSync('token', 'token_' + currentUser.userId);
          uni.setStorageSync('userInfo', JSON.stringify({
            name: currentUser.username,
            avatar: '',
            tagline: '健康生活，从我做起',
            vipLevel: 1,
            vipEndDate: '2023-12-31'
          }));

          uni.showToast({
            title: '登录成功',
            icon: 'success'
          });

          // 返回上一页
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({
            title: '用户名或密码错误',
            icon: 'none'
          });
        }
      }, 1000);
    },
    
    // 其他登录方式
    otherLogin(type) {
      uni.showToast({
        title: `${type === 'alipay' ? '支付宝' : '其他'}登录功能开发中`,
        icon: 'none'
      });
    },
    
    // 跳转到忘记密码页面
    navigateToForgetPwd() {
      uni.showToast({
        title: '忘记密码功能开发中',
        icon: 'none'
      });
    },
    
    // 跳转到注册页面
    navigateToRegister() {
      uni.navigateTo({
        url: '/pages/mine/register'
      });
    },
    
    // 查看协议
    viewProtocol(type) {
      uni.showToast({
        title: `${type === 'user' ? '用户协议' : '隐私政策'}功能开发中`,
        icon: 'none'
      });
    },
    
    // 返回
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

/* 顶部安全区域 */
.status-bar {
  height: 0;
  background-color: #fff;
}

/* 返回按钮 */
.back-btn {
  position: fixed;
  top: calc(var(--status-bar-height) + 20rpx);
  left: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.back-btn text {
  font-size: 48rpx;
  color: #3a7bd5;
  font-weight: bold;
}

/* 顶部图标和标题 */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 60rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #3a7bd5;
  margin-bottom: 20rpx;
}

.slogan {
  font-size: 28rpx;
  color: #999;
}

/* 登录表单 */
.login-form {
  padding: 0 60rpx;
  flex: 1;
}

.input-item {
  display: flex;
  align-items: center;
  height: 100rpx;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 30rpx;
}

.input-item text {
  color: #999;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.input-item input {
  flex: 1;
  height: 100rpx;
  font-size: 28rpx;
}

.toggle-password {
  font-size: 40rpx;
}

.option-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.remember-pwd {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 1rpx solid #ddd;
  border-radius: 6rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  background-color: #3a7bd5;
  border-color: #3a7bd5;
}

.checkbox.checked:after {
  content: '';
  width: 16rpx;
  height: 8rpx;
  border-left: 4rpx solid #fff;
  border-bottom: 4rpx solid #fff;
  transform: rotate(-45deg);
}

.remember-pwd text, .forget-pwd {
  font-size: 24rpx;
  color: #999;
}

.forget-pwd {
  color: #3a7bd5;
}

.login-btn {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin-bottom: 40rpx;
}

/* 微信一键登录 */
.wechat-login {
  margin-bottom: 40rpx;
}

.wechat-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  background-color: #07c160;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  box-shadow: 0 4rpx 10rpx rgba(7, 193, 96, 0.3);
}

.wechat-icon {
  font-size: 40rpx;
  margin-right: 10rpx;
}

.login-tip {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.other-login {
  margin: 40rpx 0;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.line {
  flex: 1;
  height: 1rpx;
  background-color: #f0f0f0;
}

.divider text {
  font-size: 24rpx;
  color: #999;
  margin: 0 20rpx;
}

.other-login-icons {
  display: flex;
  justify-content: center;
}

.icon-item {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f5f7fa;
  margin: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-item text {
  font-size: 40rpx;
}

.icon-item:first-child text {
  color: #07c160;
}

.icon-item:last-child text {
  color: #1677ff;
}

.register-link {
  text-align: center;
  font-size: 28rpx;
  color: #999;
}

.register-link .link {
  color: #3a7bd5;
}

/* 底部协议 */
.agreement {
  display: flex;
  align-items: flex-start;
  padding: 30rpx 60rpx 50rpx;
}

.agreement-checkbox {
  margin-top: 6rpx;
}

.agreement-text {
  flex: 1;
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
  line-height: 1.5;
}

.agreement-text .link {
  color: #3a7bd5;
}
</style> 