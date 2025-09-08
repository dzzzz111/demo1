<template>
  <view class="container">
    <!-- 顶部安全区域 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text class="iconfont icon-back">←</text>
    </view>
    
    <!-- 顶部图标和标题 -->
    <view class="register-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">创建账号</text>
      <text class="slogan">加入医疗助手，守护您的健康</text>
    </view>
    
    <!-- 注册表单 -->
    <view class="register-form">
      <!-- 用户名 -->
      <view class="input-item">
        <text class="iconfont icon-user"></text>
        <input 
          type="text" 
          v-model="registerForm.username" 
          placeholder="请输入用户名" 
          maxlength="20"
        />
      </view>
      
      <!-- 手机号 -->
      <view class="input-item">
        <text class="iconfont icon-phone"></text>
        <input 
          type="number" 
          v-model="registerForm.phone" 
          placeholder="请输入手机号" 
          maxlength="11"
        />
      </view>
      
      <!-- 密码 -->
      <view class="input-item">
        <text class="iconfont icon-password"></text>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="registerForm.password" 
          placeholder="请输入密码" 
          maxlength="20"
        />
        <text 
          class="iconfont toggle-password" 
          :class="showPassword ? 'icon-eye-open' : 'icon-eye-close'"
          @click="togglePasswordVisibility"
        ></text>
      </view>
      
      <!-- 确认密码 -->
      <view class="input-item">
        <text class="iconfont icon-password"></text>
        <input 
          :type="showConfirmPassword ? 'text' : 'password'" 
          v-model="registerForm.confirmPassword" 
          placeholder="请确认密码" 
          maxlength="20"
        />
        <text 
          class="iconfont toggle-password" 
          :class="showConfirmPassword ? 'icon-eye-open' : 'icon-eye-close'"
          @click="toggleConfirmPasswordVisibility"
        ></text>
      </view>
      
      <!-- 验证码 -->
      <view class="input-item">
        <text class="iconfont icon-code"></text>
        <input 
          type="number" 
          v-model="registerForm.code" 
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
      
      <!-- 注册按钮 -->
      <view class="register-btn" @click="register">注册</view>
      
      <!-- 返回登录 -->
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @click="navigateToLogin">返回登录</text>
      </view>
    </view>
    
    <!-- 底部协议 -->
    <view class="agreement">
      <view class="agreement-checkbox" @click="toggleAgreement">
        <view class="checkbox" :class="{ checked: agreeProtocol }"></view>
      </view>
      <text class="agreement-text">
        注册即代表您已阅读并同意 
        <text class="link" @click="viewProtocol('user')">《用户协议》</text>
        和
        <text class="link" @click="viewProtocol('privacy')">《隐私政策》</text>
      </text>
    </view>
    
    <!-- 验证码弹窗 -->
    <view class="code-modal" v-if="showCodeModal" @click="closeCodeModal">
      <view class="code-modal-content" @click.stop>
        <view class="code-modal-header">
          <text class="code-modal-title">验证码已生成</text>
          <text class="code-modal-close" @click="closeCodeModal">×</text>
        </view>
        
        <view class="code-modal-body">
          <view class="code-display">
            <text class="code-number">{{ generatedCode }}</text>
          </view>
          
          <view class="code-info">
            <text class="code-phone">手机号：{{ registerForm.phone }}</text>
            <text class="code-tip">请输入上方验证码完成注册</text>
          </view>
          
          <view class="code-actions">
            <view class="code-btn copy-btn" @click="copyCode">
              <text class="iconfont icon-copy">📋</text>
              <text>复制验证码</text>
            </view>
            <view class="code-btn confirm-btn" @click="confirmCodeReceived">
              <text class="iconfont icon-check">✓</text>
              <text>已收到</text>
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
      registerForm: {
        username: '',
        phone: '',
        password: '',
        confirmPassword: '',
        code: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      agreeProtocol: true,
      codeText: '获取验证码',
      codeBtnDisabled: false,
      countDown: 60,
      statusBarHeight: 20, // 默认值
      generatedCode: '', // 生成的验证码
      showCodeModal: false // 是否显示验证码弹窗
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    // 切换密码显示/隐藏
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    // 切换确认密码显示/隐藏
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    
    // 切换同意协议
    toggleAgreement() {
      this.agreeProtocol = !this.agreeProtocol;
    },
    
    // 发送验证码
    sendCode() {
      if (this.codeBtnDisabled) return;
      
      // 验证用户名
      if (!this.registerForm.username) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }
      
      // 验证手机号
      if (!this.registerForm.phone || !/^1\d{10}$/.test(this.registerForm.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      // 验证密码
      if (!this.registerForm.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.registerForm.password.length < 6) {
        uni.showToast({
          title: '密码不能少于6位',
          icon: 'none'
        });
        return;
      }
      
      // 验证确认密码
      if (!this.registerForm.confirmPassword) {
        uni.showToast({
          title: '请确认密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
      
      // 检查用户名是否已存在
      const existingUsers = uni.getStorageSync('registered_users') || [];
      const usernameExists = existingUsers.some(user => user.username === this.registerForm.username);
      const phoneExists = existingUsers.some(user => user.phone === this.registerForm.phone);
      
      if (usernameExists) {
        uni.showToast({
          title: '用户名已存在',
          icon: 'none'
        });
        return;
      }
      
      if (phoneExists) {
        uni.showToast({
          title: '手机号已被注册',
          icon: 'none'
        });
        return;
      }
      
      // 生成6位数字验证码
      this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 显示验证码弹窗
      this.showCodeModal = true;
    },
    
    // 关闭验证码弹窗
    closeCodeModal() {
      this.showCodeModal = false;
    },
    
    // 复制验证码
    copyCode() {
      uni.setClipboardData({
        data: this.generatedCode,
        success: () => {
          uni.showToast({
            title: '验证码已复制',
            icon: 'success'
          });
        }
      });
    },
    
    // 确认收到验证码
    confirmCodeReceived() {
      this.showCodeModal = false;
      
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
      
      uni.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
    },
    
    // 注册
    register() {
      // 检查协议是否同意
      if (!this.agreeProtocol) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }
      
      // 验证用户名
      if (!this.registerForm.username) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }
      
      // 验证手机号
      if (!this.registerForm.phone || !/^1\d{10}$/.test(this.registerForm.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      // 验证密码
      if (!this.registerForm.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.registerForm.password.length < 6) {
        uni.showToast({
          title: '密码不能少于6位',
          icon: 'none'
        });
        return;
      }
      
      // 验证确认密码
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
      
      // 验证验证码
      if (!this.registerForm.code || this.registerForm.code.length !== 6) {
        uni.showToast({
          title: '请输入6位验证码',
          icon: 'none'
        });
        return;
      }
      
      // 验证验证码是否正确
      if (this.registerForm.code !== this.generatedCode) {
        uni.showToast({
          title: '验证码错误',
          icon: 'none'
        });
        return;
      }
      
      // 检查用户名是否已存在
      const existingUsers = uni.getStorageSync('registered_users') || [];
      const usernameExists = existingUsers.some(user => user.username === this.registerForm.username);
      const phoneExists = existingUsers.some(user => user.phone === this.registerForm.phone);
      
      if (usernameExists) {
        uni.showToast({
          title: '用户名已存在',
          icon: 'none'
        });
        return;
      }
      
      if (phoneExists) {
        uni.showToast({
          title: '手机号已被注册',
          icon: 'none'
        });
        return;
      }
      
      // 模拟注册请求
      uni.showLoading({
        title: '注册中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 保存注册信息到本地缓存
        const newUser = {
          username: this.registerForm.username,
          phone: this.registerForm.phone,
          password: this.registerForm.password,
          registerTime: new Date().toISOString(),
          userId: 'user_' + Date.now()
        };
        
        existingUsers.push(newUser);
        uni.setStorageSync('registered_users', existingUsers);
        
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        });
        
        // 跳转到登录页面
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/mine/login'
          });
        }, 1500);
      }, 1000);
    },
    
    // 跳转到登录页面
    navigateToLogin() {
      uni.redirectTo({
        url: '/pages/mine/login'
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
.register-header {
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

/* 注册表单 */
.register-form {
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

.register-btn {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin-bottom: 40rpx;
}

.login-link {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.login-link .link {
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

/* 验证码弹窗 */
.code-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding-top: 100rpx;
}

.code-modal-content {
  width: 600rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.code-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
}

.code-modal-title {
  font-size: 32rpx;
  font-weight: bold;
}

.code-modal-close {
  font-size: 48rpx;
  color: #fff;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-modal-body {
  padding: 40rpx;
}

.code-display {
  text-align: center;
  margin-bottom: 30rpx;
}

.code-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #3a7bd5;
  letter-spacing: 8rpx;
  background-color: #f5f7fa;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  display: inline-block;
}

.code-info {
  text-align: center;
  margin-bottom: 40rpx;
}

.code-phone {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.code-tip {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.code-actions {
  display: flex;
  gap: 20rpx;
}

.code-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  gap: 10rpx;
}

.copy-btn {
  background-color: #f5f7fa;
  color: #666;
  border: 1rpx solid #e0e0e0;
}

.confirm-btn {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
}

.code-btn text.iconfont {
  font-size: 32rpx;
}
</style>