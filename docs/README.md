# 健康数据功能说明

本项目实现了完整的微信步数获取和健康数据管理功能。

## 功能概览

### ✅ 已实现功能

1. **微信一键登录**
   - 使用真实微信 AppID 和 AppSecret
   - 自动保存 sessionKey 到云数据库
   - 普通会员显示"永久有效"

2. **微信步数同步**
   - 支持明文和加密数据两种格式
   - 自动调用云函数解密加密数据
   - 步数以千分位格式显示（如：8,432）
   - 数据保存到本地缓存
   - 24小时自动同步机制

3. **健康数据展示**
   - 步数、睡眠、心率、血压
   - 一键同步按钮
   - 本周数据标签

### ⚠️ 待开发功能

1. **小米健康数据** - 需要申请小米健康 API
2. **华为健康数据** - 需要申请华为健康 API
3. **睡眠、心率、血压** - 依赖第三方健康 API

## 快速开始

### 1. 部署准备

确保已完成以下配置：
- [x] 微信小程序 AppID: `wx121837575fd549e6`
- [x] uniCloud 服务空间: `dzzz`
- [x] 云数据库已创建 `users` 表

### 2. 部署云函数

```bash
# 在 HBuilderX 中
1. 右键点击 uniCloud-aliyun/cloudfunctions/wechatLogin
2. 选择"上传部署云函数"
3. 重复步骤，上传 decryptWechatSteps 云函数
```

### 3. 运行测试

```bash
# 在 HBuilderX 中
1. 点击"运行" → "运行到小程序模拟器" → "微信开发者工具"
2. 在小程序中点击"我的" → "登录 / 注册" → "微信一键登录"
3. 登录成功后点击"同步数据"按钮
4. 授权微信运动，查看步数数据
```

## 核心技术

### 登录流程
```
uni.login() → 获取 code
    ↓
wechatLogin 云函数 → 调用微信 API
    ↓
获取 openid + session_key
    ↓
保存到 users 表（包含 sessionKey）
    ↓
返回 token 和用户信息
```

### 步数同步流程
```
wx.getWeRunData() → 获取加密数据
    ↓
decryptWechatSteps 云函数 → 从数据库获取 sessionKey
    ↓
AES-128-CBC 解密
    ↓
解析 stepInfoList
    ↓
返回今日步数 → 保存到本地缓存 → 更新 UI
```

## 文件结构

```
yd/
├── pages/
│   └── mine/
│       ├── login.vue              # 登录页面
│       └── index.vue              # 个人中心（健康数据展示）
├── utils/
│   └── health-service-simple.js  # 健康服务（支持加密解密）
├── config/
│   └── health-config.js          # 健康数据配置
├── uniCloud-aliyun/
│   ├── cloudfunctions/
│   │   ├── wechatLogin/          # 微信登录云函数
│   │   └── decryptWechatSteps/   # 步数解密云函数
│   └── database/
│       └── users.schema.json     # 用户表结构
└── docs/
    ├── DEPLOYMENT_GUIDE.md       # 部署指南（重要！）
    ├── TESTING_GUIDE.md          # 测试指南
    ├── QUICK_REFERENCE.md        # 快速参考
    ├── IMPLEMENTATION_SUMMARY.md # 实现总结
    └── README.md                 # 本文件
```

## 关键代码

### 获取微信步数
```javascript
// utils/health-service-simple.js
async getWechatSteps() {
  return new Promise(async (resolve, reject) => {
    wx.getWeRunData({
      success: async (res) => {
        if (res.stepInfoList && res.stepInfoList.length > 0) {
          // 直接返回步数（无需解密）
          resolve(res.stepInfoList[0].step || 0)
        } else if (res.encryptedData && res.iv) {
          // 调用云函数解密
          const steps = await this.decryptWechatStepsData(
            res.encryptedData,
            res.iv
          )
          resolve(steps)
        }
      }
    })
  })
}
```

### 解密云函数
```javascript
// uniCloud-aliyun/cloudfunctions/decryptWechatSteps/index.js
exports.main = async (event, context) => {
  const { encryptedData, iv, openid } = event

  // 从数据库获取 sessionKey
  const user = await usersCollection.where({ openid }).get()
  const sessionKey = user.data[0].sessionKey

  // AES-128-CBC 解密
  const crypto = require('crypto')
  const decipher = crypto.createDecipheriv(
    'aes-128-cbc',
    Buffer.from(sessionKey, 'base64'),
    Buffer.from(iv, 'base64')
  )

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  // 解析步数
  const data = JSON.parse(decrypted)
  const todaySteps = data.stepInfoList[0].step

  return {
    code: 0,
    data: { steps: { today: todaySteps } }
  }
}
```

## 常见问题

### Q1: 登录失败怎么办？
**A**: 检查 AppID 和 AppSecret 是否正确，确保云函数已上传。

### Q2: 步数显示为 0？
**A**: 确认已授权微信运动，且微信中有运动数据。真机测试效果更好。

### Q3: 提示"需要通过云函数解密"？
**A**: 这个错误已经修复！请确保：
1. `decryptWechatSteps` 云函数已上传
2. `users` 表中有 sessionKey 字段
3. 用户已登录

### Q4: 如何查看详细日志？
**A**: 在微信开发者工具的"Console"标签中查看，所有关键步骤都有日志输出。

## 测试检查清单

### 登录测试
- [ ] 点击"微信一键登录"能成功登录
- [ ] 登录后显示用户信息
- [ ] VIP 显示"普通会员 - 永久有效"
- [ ] users 表中保存了 sessionKey

### 步数同步测试
- [ ] 点击"同步数据"能触发同步
- [ ] 首次使用弹出授权提示
- [ ] 授权后能获取到步数
- [ ] 步数正确显示（格式化为千分位）
- [ ] 本地 Storage 中保存了 healthData
- [ ] 重启小程序数据仍然存在

### 错误处理测试
- [ ] 未登录时不显示健康数据卡片
- [ ] 未授权时显示友好提示
- [ ] 网络错误时显示提示信息
- [ ] 同步失败时返回缓存数据

## 详细文档

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 完整的部署步骤，包括数据库创建、云函数上传、测试验证
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - 详细的测试指南，包括测试步骤、预期结果、问题排查
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - 快速参考，包括关键代码、数据流程、故障排查
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - 完整的实现总结，记录所有修改和技术细节

## 技术栈

- **前端框架**: UniApp (Vue 2)
- **云服务**: uniCloud (阿里云)
- **数据库**: 云数据库
- **云函数**: Node.js
- **加密算法**: AES-128-CBC
- **微信 API**: wx.login, wx.getWeRunData

## 配置信息

```javascript
// 微信小程序
AppID: wx121837575fd549e6
AppSecret: 45cdeeb69b02aa79bde8bb830d897ce9

// uniCloud 服务空间
名称: dzzz
SpaceId: mp-aec6565b-c333-4030-8492-6cc423e8ca1a
```

## 下一步开发

### 短期（1-2周）
- [ ] 添加步数历史记录
- [ ] 实现数据图表展示
- [ ] 优化加载动画

### 中期（1-2月）
- [ ] 实现步数排行榜
- [ ] 添加每日打卡功能
- [ ] 优化数据同步策略

### 长期（3-6月）
- [ ] 申请小米健康 API
- [ ] 申请华为健康 API
- [ ] 实现健康数据分析
- [ ] 添加 AI 健康建议

## 贡献指南

如果你想改进这个功能，请：
1. 阅读 `IMPLEMENTATION_SUMMARY.md` 了解技术细节
2. 参考 `QUICK_REFERENCE.md` 查看代码结构
3. 按照 `DEPLOYMENT_GUIDE.md` 部署测试环境
4. 使用 `TESTING_GUIDE.md` 进行完整测试

## 许可证

本项目仅供学习和参考使用。

---

**需要帮助？** 请查看 `docs/` 目录下的详细文档！

*最后更新: 2023年12月*
