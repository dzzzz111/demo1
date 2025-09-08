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
      <!-- 切换登录方式 -->
      <view class="tab-header">
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'password' }"
          @click="switchLoginType('password')"
        >
          密码登录
        </view>
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'code' }"
          @click="switchLoginType('code')"
        >
          验证码登录
        </view>
      </view>
      
      <!-- 密码登录表单 -->
      <view v-if="loginType === 'password'">
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
      
      <!-- 验证码登录表单 -->
      <view v-else>
        <view class="input-item">
          <text class="iconfont icon-phone"></text>
          <input 
            type="number" 
            v-model="codeForm.phone" 
            placeholder="请输入手机号" 
            maxlength="11"
          />
        </view>
        <view class="input-item">
          <text class="iconfont icon-code"></text>
          <input 
            type="number" 
            v-model="codeForm.code" 
            placeholder="请输入验证码" 
            maxlength="6"
          />
          <view 
            class="code-btn" 
            :class="{ disabled: codeBtnDisabled }"
            @click="sendCode"
          >
            {{ codeText }}
          </view>
        </view>
      </view>
      
      <!-- 记住密码/忘记密码 -->
      <view class="option-row" v-if="loginType === 'password'">
        <view class="remember-pwd" @click="toggleRememberPwd">
          <view class="checkbox" :class="{ checked: rememberPwd }"></view>
          <text>记住密码</text>
        </view>
        <text class="forget-pwd" @click="navigateToForgetPwd">忘记密码？</text>
      </view>
      
      <!-- 登录按钮 -->
      <view class="login-btn" @click="login">登录</view>
      
      <!-- 其他登录方式 -->
      <view class="other-login">
        <view class="divider">
          <view class="line"></view>
          <text>其他登录方式</text>
          <view class="line"></view>
        </view>
        <view class="other-login-icons">
          <view class="icon-item" @click="otherLogin('wechat')">
            <text class="iconfont icon-wechat"></text>
          </view>
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
      loginType: 'password', // password: 密码登录, code: 验证码登录
      passwordForm: {
        username: '',
        password: ''
      },
      codeForm: {
        phone: '',
        code: ''
      },
      showPassword: false,
      rememberPwd: false,
      agreeProtocol: true,
      codeText: '获取验证码',
      codeBtnDisabled: false,
      countDown: 60,
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
    // 切换登录方式
    switchLoginType(type) {
      this.loginType = type;
    },
    
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
    
    // 发送验证码
    sendCode() {
      if (this.codeBtnDisabled) return;
      
      // 验证手机号
      if (!this.codeForm.phone || !/^1\d{10}$/.test(this.codeForm.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      // 开始倒计时
      this.codeBtnDisabled = true;
      this.codeText = `${this.countDown}s`;
      
      const timer = setInterval(() => {
        this.countDown--;
        this.codeText = `${this.countDown}s`;
        
        if (this.countDown <= 0) {
          clearInterval(timer);
          this.codeBtnDisabled = false;
          this.codeText = '获取验证码';
          this.countDown = 60;
        }
      }, 1000);
      
      // 模拟发送验证码
      uni.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
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
      
      if (this.loginType === 'password') {
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
      } else {
        // 验证码登录验证
        if (!this.codeForm.phone || !/^1\d{10}$/.test(this.codeForm.phone)) {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
          });
          return;
        }
        
        if (!this.codeForm.code || this.codeForm.code.length !== 6) {
          uni.showToast({
            title: '请输入6位验证码',
            icon: 'none'
          });
          return;
        }
      }
      
      // 模拟登录请求
      uni.showLoading({
        title: '登录中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 从本地缓存获取注册用户信息
        const registeredUsers = uni.getStorageSync('registered_users') || [];
        let userFound = false;
        let currentUser = null;
        
        if (this.loginType === 'password') {
          // 密码登录验证
          currentUser = registeredUsers.find(user => 
            user.username === this.passwordForm.username && 
            user.password === this.passwordForm.password
          );
        } else {
          // 验证码登录验证（简化版，直接验证手机号）
          currentUser = registeredUsers.find(user => user.phone === this.codeForm.phone);
        }
        
        if (currentUser) {
          // 登录成功，保存token和用户信息
          uni.setStorageSync('token', 'user_token_' + currentUser.userId);
          uni.setStorageSync('userInfo', JSON.stringify({
            name: currentUser.username,
            phone: currentUser.phone,
            avatar: '',
            tagline: '健康生活，从我做起',
            vipLevel: 1,
            vipEndDate: '2023-12-31',
            userId: currentUser.userId
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
            title: this.loginType === 'password' ? '用户名或密码错误' : '手机号未注册',
            icon: 'none'
          });
        }
      }, 1000);
    },
    
    // 其他登录方式
    otherLogin(type) {
      uni.showToast({
        title: `${type === 'wechat' ? '微信' : '支付宝'}登录功能开发中`,
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

.tab-header {
  display: flex;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 30rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  color: #999;
  padding: 20rpx 0;
  position: relative;
}

.tab-item.active {
  color: #3a7bd5;
  font-weight: 500;
}

.tab-item.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 4rpx;
  background-color: #3a7bd5;
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

.code-btn {
  width: 200rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
  background-color: #3a7bd5;
  color: #fff;
  font-size: 24rpx;
}

.code-btn.disabled {
  background-color: #ccc;
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