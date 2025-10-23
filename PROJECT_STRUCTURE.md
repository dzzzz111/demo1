# 📁 AI医疗助手项目完整结构说明

## 🎯 项目概述

这是一个基于 **UniApp + Vue 2 + uniCloud** 的智能医疗小程序项目，提供AI问诊、图像诊断、健康数据追踪和社区交流等功能。

---

## 📂 项目根目录文件

### 核心配置文件

#### `manifest.json` ⭐ 重要
**用途**: UniApp项目配置文件
**内容**:
- 小程序AppID: `wx121837575fd549e6`
- 应用名称、版本号
- 各平台（微信/支付宝/百度等）配置
- 权限配置（微信运动等）
- 代码压缩和优化设置

**关键配置**:
```json
{
  "mp-weixin": {
    "appid": "wx121837575fd549e6",
    "setting": {
      "es6": true,        // ES6转ES5
      "minified": true,   // 代码压缩
      "postcss": true     // CSS后处理
    },
    "optimization": {
      "subPackages": true // 分包优化
    }
  }
}
```

#### `pages.json` ⭐ 重要
**用途**: 页面路由配置文件
**内容**:
- 主包页面路径（首页、个人中心、社区）
- 分包配置（pagesA、pagesB）
- 全局样式配置
- TabBar配置（底部导航栏）

**分包结构**:
```
主包: pages/
  - index/index      首页
  - mine/index       个人中心
  - community/index  社区

分包A: pagesA/
  - ai-doctor/index      AI问诊
  - image-diagnose/index 图像诊断

分包B: pagesB/
  - mine/login          登录
  - mine/register       注册
  - mine/settings       设置
  - community/detail    社区详情
```

#### `main.js`
**用途**: 项目入口文件
**内容**:
- Vue实例初始化
- 兼容Vue 2和Vue 3
- 导入全局配置

#### `App.vue`
**用途**: 全局应用配置
**内容**:
- 应用生命周期
- 全局样式
- 全局变量

#### `package.json`
**用途**: npm依赖管理
**内容**:
```json
{
  "dependencies": {
    "axios": "^1.11.0"  // HTTP请求库
  }
}
```

#### `uni.scss`
**用途**: 全局SCSS变量和混入
**内容**:
- 全局颜色变量
- 全局尺寸变量
- SCSS混入函数

---

## 📱 主包页面 (pages/)

### `pages/index/` - 首页

#### `index.vue` ⭐ 核心页面
**功能**: 医疗助手首页
**内容**:
- 轮播图（健康资讯）
- AI功能入口（AI问诊、图像诊断）
- 今日值班医生展示
- 快捷功能区

**路由**: `/pages/index/index`

**跳转**:
```javascript
'/pagesA/ai-doctor/index'      // AI问诊
'/pagesA/image-diagnose/index' // 图像诊断
```

#### `simple.vue`
**功能**: 简化版首页（备用）

---

### `pages/mine/` - 个人中心

#### `index.vue` ⭐ 核心页面
**功能**: 个人中心主页
**内容**:
- 用户信息展示（头像、昵称）
- 登录/未登录状态切换
- 健康数据卡片（步数、睡眠、心率、血压）
- 功能列表：
  - 健康档案（病历、体检、用药记录）
  - 服务记录（问诊、诊断记录）
  - 系统设置
- 同步健康数据功能

**路由**: `/pages/mine/index`

**数据来源**:
```javascript
import healthService from '@/utils/health-service-simple.js'
```

---

### `pages/community/` - 健康社区

#### `index.vue` ⭐ 核心页面
**功能**: 健康社区主页
**内容**:
- 分类标签（全部、疾病、治疗、用药等）
- 帖子列表（标题、内容、图片、点赞评论数）
- 互动功能（点赞、评论、分享、收藏）
- 下拉刷新
- 上拉加载更多

**路由**: `/pages/community/index`

**跳转**:
```javascript
`/pagesB/community/detail?id=${post.id}` // 帖子详情
```

---

## 📦 分包A (pagesA/) - AI功能

### `pagesA/ai-doctor/` - AI智能问诊

#### `index.vue` ⭐ 核心功能
**功能**: AI医生智能问诊
**内容**:
- 聊天界面（用户消息、AI回复）
- 消息输入框
- 快捷问题推荐
- 历史对话记录
- AI服务调用

**路由**: `/pagesA/ai-doctor/index`

**AI服务**:
```javascript
import aiService from '@/utils/ai-service.js'
```

**支持的AI平台**:
- 阿里云百炼（dashscope）
- ChatGLM（智谱AI）
- 通义千问（Qwen）

---

### `pagesA/image-diagnose/` - 图像智能诊断

#### `index.vue` ⭐ 核心功能
**功能**: 医学影像智能分析
**内容**:
- 图片上传（拍照或相册）
- 图像预览
- AI分析结果展示
- 诊断建议
- 历史记录

**路由**: `/pagesA/image-diagnose/index`

**AI服务**:
```javascript
import imageAnalysis from '@/utils/image-analysis.js'
```

**支持的分析**:
- MRI扫描分析
- X光片分析
- CT影像分析

---

## 📦 分包B (pagesB/) - 用户功能

### `pagesB/mine/` - 用户相关

#### `login.vue` ⭐ 核心功能
**功能**: 用户登录
**内容**:
- 用户名密码登录
- 微信一键登录
- 记住密码
- 忘记密码（开发中）
- 协议勾选

**路由**: `/pagesB/mine/login`

**登录方式**:
1. **微信登录**:
```javascript
uni.login() → 获取code
→ 调用云函数 wechatLogin
→ 返回token和用户信息
```

2. **账号密码登录**:
```javascript
验证本地缓存 registered_users
→ 保存token和userInfo
→ 返回个人中心
```

#### `register.vue`
**功能**: 用户注册
**内容**:
- 用户名、密码输入
- 手机号验证
- 验证码（开发中）
- 协议勾选

**路由**: `/pagesB/mine/register`

**注册流程**:
```javascript
保存到本地缓存 registered_users[]
→ 自动登录
→ 返回个人中心
```

#### `settings.vue`
**功能**: 系统设置
**内容**:
- 个人信息设置
- 隐私设置
- 通知设置
- 清除缓存
- 退出登录

**路由**: `/pagesB/mine/settings`

---

### `pagesB/community/` - 社区详情

#### `detail.vue`
**功能**: 帖子详情页
**内容**:
- 帖子完整内容
- 作者信息
- 图片展示
- 评论列表
- 评论输入

**路由**: `/pagesB/community/detail?id=xxx`

---

## 🛠 工具类 (utils/)

### `ai-service.js` ⭐ 核心服务
**功能**: AI服务统一接口
**内容**:
- 多AI平台集成（阿里云百炼、ChatGLM、Qwen）
- 流式对话支持
- 错误处理
- API密钥管理

**主要方法**:
```javascript
sendMessage(message, history)  // 发送消息
streamChat(message, history, onChunk)  // 流式对话
```

**配置**:
```javascript
import aiConfig from '@/config/ai-config.js'
```

---

### `health-service.js` 和 `health-service-simple.js`
**功能**: 健康数据服务
**内容**:
- 微信运动步数获取
- 健康数据同步
- 数据加密解密（AES-128-CBC）
- 本地存储管理

**主要方法**:
```javascript
// health-service.js (完整版)
getWechatSteps()           // 获取微信步数
syncHealthData()           // 同步健康数据
saveHealthData()           // 保存数据

// health-service-simple.js (简化版)
getLocalHealthData()       // 获取本地数据
needSync()                 // 检查是否需要同步
```

**云函数调用**:
```javascript
uniCloud.callFunction({
  name: 'decryptWechatSteps',
  data: { encryptedData, iv, sessionKey }
})
```

---

### `image-analysis.js`
**功能**: 图像分析服务
**内容**:
- 图片上传处理
- AI图像分析
- 医学影像识别
- 结果解析

**主要方法**:
```javascript
analyzeImage(imageData)    // 分析图像
uploadImage(filePath)      // 上传图片
```

---

## ⚙️ 配置文件 (config/)

### `ai-config.js`
**功能**: AI平台配置
**内容**:
```javascript
{
  platform: 'dashscope',  // 或 'chatglm', 'qwen'
  apiKey: 'your-api-key',
  apiUrl: 'https://...',
  model: 'qwen-max'
}
```

### `health-config.js` ⭐ 重要
**功能**: 健康数据配置
**内容**:
- 健康数据提供商（小米、华为、微信）
- 数据类型（步数、睡眠、心率、血压）
- 同步设置
- 云函数名称

**配置示例**:
```javascript
{
  providers: {
    wechat: {
      name: '微信运动',
      supportedTypes: ['steps']
    }
  },
  dataTypes: {
    steps: { name: '步数', unit: '步' },
    sleep: { name: '睡眠', unit: '小时' }
  }
}
```

### `cloud-config.js`
**功能**: uniCloud配置
**内容**:
- 云函数名称
- 云数据库配置
- 服务空间ID

### `wechat-config.js`
**功能**: 微信相关配置
**内容**:
- 小程序AppID
- 权限配置

### `env-config.js`
**功能**: 环境变量配置
**内容**:
- 开发/生产环境切换
- API地址配置

---

## ☁️ 云函数 (uniCloud-aliyun/cloudfunctions/)

### `wechatLogin/` ⭐ 核心功能
**功能**: 微信登录
**文件**:
- `index.js` - 云函数主文件
- `package.json` - 依赖配置

**流程**:
```javascript
1. 接收code
2. 调用微信API获取openid和session_key
3. 查询/创建用户记录
4. 返回token和用户信息
```

**API调用**:
```javascript
https://api.weixin.qq.com/sns/jscode2session
→ appid + secret + code
→ 返回 openid + session_key
```

---

### `decryptWechatSteps/`
**功能**: 解密微信运动数据
**流程**:
```javascript
1. 接收加密数据（encryptedData + iv）
2. 使用session_key解密（AES-128-CBC）
3. 返回步数数据
```

---

### `getHealthData/`
**功能**: 获取健康数据
**流程**:
```javascript
1. 查询用户健康数据
2. 返回历史记录
```

---

### `fun/`
**功能**: 通用工具云函数
**内容**: 测试或辅助功能

---

## 🖼️ 静态资源 (static/)

### `icons/` - 功能图标
- `ai-icon.png` (752KB) - AI问诊图标 ⚠️ 需压缩
- `image-icon.png` (770KB) - 图像诊断图标 ⚠️ 需压缩

### `images/` - 图片素材
- `news1.png` (938KB) ⚠️ 需压缩
- `news2.png` (480KB) ⚠️ 需压缩
- `news3.png` (755KB) ⚠️ 需压缩
- `ai-avatar.png` (747KB) - AI头像 ⚠️ 需压缩
- `user-avatar.png` (324KB) - 用户头像 ⚠️ 需压缩
- `default-avatar.png` (261KB) - 默认头像 ⚠️ 需压缩

### `tabbar/` - 底部导航图标
- 首页图标（选中/未选中）
- 社区图标（选中/未选中）
- 我的图标（选中/未选中）

### `logo.png`
**用途**: 应用Logo

**⚠️ 重要提示**: 所有大于100KB的图片都需要压缩！

---

## 📄 文档 (docs/)

### `IMAGE_OPTIMIZATION.md`
**功能**: 图片优化指南
**内容**:
- 图片压缩方法
- 在线工具推荐
- WebP格式转换
- CDN使用建议

### `README.md`
**功能**: 项目说明文档
**内容**:
- 功能列表
- 快速开始
- 技术栈
- 配置说明

---

## 📝 其他重要文件

### `CLAUDE.md`
**功能**: Claude Code项目概述
**内容**:
- 项目介绍
- 代码库结构
- 开发命令
- AI集成说明

### `OPTIMIZATION_SUMMARY.md`
**功能**: 优化修复总结
**内容**:
- 代码压缩配置
- 分包配置
- 文件移动记录
- 性能提升数据

### `.gitignore`
**功能**: Git忽略配置
**内容**:
- `node_modules/` - 依赖文件
- `unpackage/` - 编译输出
- `.hbuilderx/` - 编辑器配置

### `project.config.json`
**功能**: 微信开发者工具配置
**内容**:
- 项目名称
- AppID
- 编译设置

---

## 🗂️ 目录结构总览

```
ai-med-companion/
├── pages/                  # 主包页面（首页、个人中心、社区）
│   ├── index/             # 首页
│   ├── mine/              # 个人中心
│   └── community/         # 社区
│
├── pagesA/                # 分包A - AI功能
│   ├── ai-doctor/         # AI问诊
│   └── image-diagnose/    # 图像诊断
│
├── pagesB/                # 分包B - 用户功能
│   ├── mine/              # 登录、注册、设置
│   └── community/         # 社区详情
│
├── uniCloud-aliyun/       # uniCloud云服务
│   └── cloudfunctions/    # 云函数
│       ├── wechatLogin/   # 微信登录
│       ├── decryptWechatSteps/ # 解密步数
│       └── getHealthData/ # 获取健康数据
│
├── utils/                 # 工具类
│   ├── ai-service.js      # AI服务
│   ├── health-service.js  # 健康数据服务
│   └── image-analysis.js  # 图像分析
│
├── config/                # 配置文件
│   ├── ai-config.js       # AI配置
│   ├── health-config.js   # 健康数据配置
│   ├── cloud-config.js    # 云服务配置
│   └── wechat-config.js   # 微信配置
│
├── static/                # 静态资源
│   ├── icons/             # 功能图标
│   ├── images/            # 图片素材
│   ├── tabbar/            # 底部导航图标
│   └── logo.png           # Logo
│
├── docs/                  # 文档
│   └── IMAGE_OPTIMIZATION.md
│
├── manifest.json          # UniApp配置 ⭐
├── pages.json             # 页面路由配置 ⭐
├── main.js                # 项目入口 ⭐
├── App.vue                # 全局应用配置
├── package.json           # npm依赖
└── uni.scss               # 全局样式变量
```

---

## 🔄 数据流程图

### 微信登录流程
```
用户点击登录
  ↓
uni.login() 获取code
  ↓
调用云函数 wechatLogin
  ↓
云函数调用微信API
  ↓
返回 openid + session_key
  ↓
查询/创建用户记录
  ↓
返回 token + userInfo
  ↓
保存到本地缓存
  ↓
登录成功
```

### 健康数据同步流程
```
用户点击同步
  ↓
获取微信运动权限
  ↓
wx.getWeRunData() 获取加密数据
  ↓
调用云函数 decryptWechatSteps
  ↓
解密数据
  ↓
返回步数
  ↓
保存到本地缓存
  ↓
更新UI显示
```

### AI问诊流程
```
用户发送消息
  ↓
调用 ai-service.sendMessage()
  ↓
根据配置选择AI平台
  ↓
调用AI API（阿里云/ChatGLM/Qwen）
  ↓
返回AI回复
  ↓
显示在聊天界面
  ↓
保存历史记录
```

---

## 🎯 核心功能模块

### 1. 用户模块
- 登录/注册（微信登录 + 账号密码）
- 个人信息管理
- 会员系统
- 退出登录

### 2. AI问诊模块
- 多AI平台支持
- 聊天对话
- 历史记录
- 快捷问题

### 3. 图像诊断模块
- 图片上传
- AI分析
- 诊断报告
- 历史记录

### 4. 健康数据模块
- 微信运动步数
- 睡眠数据（开发中）
- 心率数据（开发中）
- 血压数据（开发中）
- 数据同步
- 数据可视化

### 5. 社区模块
- 帖子列表
- 分类浏览
- 点赞/评论/分享
- 帖子详情

---

## 🔑 关键技术点

### 1. 分包加载
**目的**: 减少主包大小，提升首屏加载速度
**配置**: `pages.json`
**效果**: 主包 < 1.5M

### 2. 代码压缩
**目的**: 减小代码体积
**配置**: `manifest.json`
```json
{
  "es6": true,
  "minified": true,
  "postcss": true
}
```

### 3. 微信登录
**技术**: uni.login() + 云函数
**加密**: session_key
**存储**: uniCloud数据库

### 4. 健康数据加密
**算法**: AES-128-CBC
**密钥**: session_key
**解密**: 云函数 decryptWechatSteps

### 5. AI服务集成
**平台**: 阿里云百炼、ChatGLM、Qwen
**接口**: HTTP POST
**格式**: JSON

---

## 📊 项目规模

- **总页面数**: 约12个
- **云函数数**: 4个
- **工具类**: 4个
- **配置文件**: 5个
- **代码行数**: 约8000+行
- **静态资源**: 约5MB（待优化）

---

## ⚠️ 待优化项

### 1. 图片压缩
所有大于100KB的图片需要压缩到合理大小

### 2. 功能完善
- 忘记密码
- 用户协议
- 隐私政策
- 关于我们
- 意见反馈

### 3. 数据库设计
需要在uniCloud中创建完整的数据库表结构

### 4. 错误处理
增加更完善的错误提示和异常处理

---

**文档更新时间**: 2025-10-22 23:46
**项目版本**: v1.0.0
**技术栈**: UniApp + Vue 2 + uniCloud + 阿里云百炼
