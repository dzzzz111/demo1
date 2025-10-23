<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="iconfont">‹</text>
        </view>
        <text class="header-title">系统设置</text>
        <view class="placeholder"></view>
      </view>
    </view>
    
    <!-- 设置列表 -->
    <view class="settings-list">
      <!-- 账号设置 -->
      <view class="settings-group">
        <view class="group-title">账号设置</view>
        <view class="settings-item" @click="navigateTo('/pages/mine/profile')">
          <view class="item-icon">
            <text class="iconfont">👤</text>
          </view>
          <view class="item-content">
            <text class="item-name">个人资料</text>
            <text class="item-desc">修改个人信息、头像等</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
        <view class="settings-item" @click="navigateTo('/pages/mine/security')">
          <view class="item-icon">
            <text class="iconfont">🔐</text>
          </view>
          <view class="item-content">
            <text class="item-name">账号安全</text>
            <text class="item-desc">修改密码、绑定手机等</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
        <view class="settings-item" @click="navigateTo('/pages/mine/privacy')">
          <view class="item-icon">
            <text class="iconfont">🔒</text>
          </view>
          <view class="item-content">
            <text class="item-name">隐私设置</text>
            <text class="item-desc">管理隐私权限和数据</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
      </view>
      
      <!-- 通用设置 -->
      <view class="settings-group">
        <view class="group-title">通用设置</view>
        <view class="settings-item">
          <view class="item-icon">
            <text class="iconfont">🔔</text>
          </view>
          <view class="item-content">
            <text class="item-name">消息通知</text>
            <text class="item-desc">接收系统消息和健康提醒</text>
          </view>
          <switch :checked="settings.notification" @change="toggleSetting('notification')" color="#3a7bd5"/>
        </view>
        <view class="settings-item">
          <view class="item-icon">
            <text class="iconfont">🌙</text>
          </view>
          <view class="item-content">
            <text class="item-name">深色模式</text>
            <text class="item-desc">夜间使用更护眼</text>
          </view>
          <switch :checked="settings.darkMode" @change="toggleSetting('darkMode')" color="#3a7bd5"/>
        </view>
        <view class="settings-item" @click="openLanguageSettings">
          <view class="item-icon">
            <text class="iconfont">🌐</text>
          </view>
          <view class="item-content">
            <text class="item-name">语言设置</text>
            <text class="item-desc">当前：简体中文</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
        <view class="settings-item" @click="openCacheSettings">
          <view class="item-icon">
            <text class="iconfont">💾</text>
          </view>
          <view class="item-content">
            <text class="item-name">存储管理</text>
            <text class="item-desc">清理缓存，释放空间</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
      </view>
      
      <!-- AI设置 -->
      <view class="settings-group">
        <view class="group-title">AI设置</view>
        <view class="settings-item" @click="openAISettings">
          <view class="item-icon">
            <text class="iconfont">🤖</text>
          </view>
          <view class="item-content">
            <text class="item-name">AI模型选择</text>
            <text class="item-desc">选择适合的AI助手</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
        <view class="settings-item">
          <view class="item-icon">
            <text class="iconfont">🗣️</text>
          </view>
          <view class="item-content">
            <text class="item-name">语音输入</text>
            <text class="item-desc">启用语音识别功能</text>
          </view>
          <switch :checked="settings.voiceInput" @change="toggleSetting('voiceInput')" color="#3a7bd5"/>
        </view>
        <view class="settings-item">
          <view class="item-icon">
            <text class="iconfont">📝</text>
          </view>
          <view class="item-content">
            <text class="item-name">智能建议</text>
            <text class="item-desc">根据历史记录提供个性化建议</text>
          </view>
          <switch :checked="settings.smartSuggestion" @change="toggleSetting('smartSuggestion')" color="#3a7bd5"/>
        </view>
      </view>
      
      <!-- 其他设置 -->
      <view class="settings-group">
        <view class="group-title">其他</view>
        <view class="settings-item" @click="checkUpdate">
          <view class="item-icon">
            <text class="iconfont">🔄</text>
          </view>
          <view class="item-content">
            <text class="item-name">检查更新</text>
            <text class="item-desc">当前版本 v1.0.0</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
        <view class="settings-item" @click="clearData">
          <view class="item-icon">
            <text class="iconfont">🗑️</text>
          </view>
          <view class="item-content">
            <text class="item-name">清除数据</text>
            <text class="item-desc">清除所有本地数据</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
        <view class="settings-item" @click="resetSettings">
          <view class="item-icon">
            <text class="iconfont">🔄</text>
          </view>
          <view class="item-content">
            <text class="item-name">恢复默认设置</text>
            <text class="item-desc">重置所有设置为默认值</text>
          </view>
          <text class="iconfont icon-right">›</text>
        </view>
      </view>
    </view>
    
    <!-- 底部操作 -->
    <view class="bottom-actions">
      <view class="action-btn" @click="exportSettings">
        <text class="iconfont">📤</text>
        <text>导出设置</text>
      </view>
      <view class="action-btn" @click="importSettings">
        <text class="iconfont">📥</text>
        <text>导入设置</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      settings: {
        notification: true,
        darkMode: false,
        voiceInput: false,
        smartSuggestion: true
      }
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    
    // 加载设置
    this.loadSettings();
  },
  methods: {
    loadSettings() {
      // 从本地存储加载设置
      const savedSettings = uni.getStorageSync('app_settings');
      if (savedSettings) {
        try {
          this.settings = JSON.parse(savedSettings);
        } catch (e) {
          console.error('加载设置失败:', e);
        }
      }
    },
    
    saveSettings() {
      // 保存设置到本地存储
      uni.setStorageSync('app_settings', JSON.stringify(this.settings));
    },
    
    toggleSetting(settingName) {
      // 切换设置
      this.settings[settingName] = !this.settings[settingName];
      this.saveSettings();
      
      // 特殊处理
      if (settingName === 'darkMode') {
        this.applyDarkMode();
      }
    },
    
    applyDarkMode() {
      // 应用深色模式
      if (this.settings.darkMode) {
        uni.showToast({
          title: '深色模式已开启',
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: '深色模式已关闭',
          icon: 'success'
        });
      }
    },
    
    navigateTo(url) {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    openLanguageSettings() {
      uni.showActionSheet({
        itemList: ['简体中文', '繁體中文', 'English'],
        success: (res) => {
          const languages = ['简体中文', '繁體中文', 'English'];
          uni.showToast({
            title: `已切换至${languages[res.tapIndex]}`,
            icon: 'success'
          });
        }
      });
    },
    
    openCacheSettings() {
      uni.showModal({
        title: '存储管理',
        content: '确定要清理缓存吗？这将清除临时文件但不影响个人数据。',
        confirmText: '清理',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '清理中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '缓存清理完成',
                icon: 'success'
              });
            }, 1500);
          }
        }
      });
    },
    
    openAISettings() {
      uni.showActionSheet({
        itemList: ['ChatGLM', '通义千问', '文心一言', 'GPT-3.5'],
        success: (res) => {
          const models = ['ChatGLM', '通义千问', '文心一言', 'GPT-3.5'];
          uni.showToast({
            title: `已切换至${models[res.tapIndex]}`,
            icon: 'success'
          });
        }
      });
    },
    
    checkUpdate() {
      uni.showLoading({
        title: '检查中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showModal({
          title: '检查更新',
          content: '当前已是最新版本 v1.0.0',
          showCancel: false,
          confirmText: '确定'
        });
      }, 2000);
    },
    
    clearData() {
      uni.showModal({
        title: '清除数据',
        content: '确定要清除所有本地数据吗？此操作不可恢复！',
        confirmText: '清除',
        confirmColor: '#f44336',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '清除中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '数据已清除',
                icon: 'success'
              });
            }, 1500);
          }
        }
      });
    },
    
    resetSettings() {
      uni.showModal({
        title: '恢复默认设置',
        content: '确定要恢复所有设置为默认值吗？',
        confirmText: '恢复',
        success: (res) => {
          if (res.confirm) {
            this.settings = {
              notification: true,
              darkMode: false,
              voiceInput: false,
              smartSuggestion: true
            };
            this.saveSettings();
            
            uni.showToast({
              title: '设置已恢复默认',
              icon: 'success'
            });
          }
        }
      });
    },
    
    exportSettings() {
      const settingsData = JSON.stringify(this.settings, null, 2);
      uni.setClipboardData({
        data: settingsData,
        success: () => {
          uni.showToast({
            title: '设置已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    },
    
    importSettings() {
      uni.showModal({
        title: '导入设置',
        content: '请将设置数据粘贴到剪贴板，然后点击确定',
        editable: true,
        placeholderText: '粘贴设置数据...',
        success: (res) => {
          if (res.confirm && res.content) {
            try {
              const importedSettings = JSON.parse(res.content);
              this.settings = { ...this.settings, ...importedSettings };
              this.saveSettings();
              
              uni.showToast({
                title: '设置导入成功',
                icon: 'success'
              });
            } catch (e) {
              uni.showToast({
                title: '设置数据格式错误',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    goBack() {
      uni.navigateBack();
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
  height: 180rpx;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
}

.status-bar {
  width: 100%;
}

.nav-bar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
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
  font-weight: bold;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
}

.placeholder {
  width: 60rpx;
}

/* 设置列表 */
.settings-list {
  padding: 30rpx;
}

.settings-group {
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
  font-weight: 500;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(58, 123, 213, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.item-icon text {
  font-size: 36rpx;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #999;
}

.icon-right {
  color: #ccc;
  font-size: 32rpx;
  margin-left: 20rpx;
}

/* 开关样式 */
switch {
  transform: scale(0.8);
}

/* 底部操作 */
.bottom-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  background-color: #fff;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 28rpx;
  color: #3a7bd5;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-btn text {
  font-size: 28rpx;
}
</style>