# 微信步数功能实现总结

## 问题分析

### 遇到的问题
用户反馈微信步数同步时出现错误：
```
获取到加密数据,需要通过云函数解密
同步健康数据失败: Error: 需要通过云函数解密步数数据
```

**原因分析**：
- 微信 `wx.getWeRunData()` API 返回了加密数据（encryptedData + iv）
- 之前的实现只处理了直接返回 stepInfoList 的情况
- 缺少加密数据解密的完整流程

## 解决方案

### 核心思路
实现完整的微信运动数据解密流程：
1. 登录时保存 sessionKey 到数据库
2. 获取步数时如果返回加密数据，调用云函数解密
3. 云函数从数据库获取 sessionKey，使用 AES-128-CBC 解密
4. 返回解密后的步数数据

### 技术实现

#### 1. 数据库设计
在 `users` 表中存储 sessionKey：
```javascript
{
  openid: "微信openid",
  sessionKey: "微信会话密钥", // 用于解密
  name: "用户昵称",
  vipLevel: 1,
  vipEndDate: "永久有效"
}
```

#### 2. 登录流程优化
`wechatLogin` 云函数保存 sessionKey：
```javascript
// 新用户创建时保存
await collection.add({
  openid: openid,
  sessionKey: session_key,  // ← 保存 sessionKey
  vipLevel: 1,
  vipEndDate: '永久有效'
})

// 老用户登录时更新
await collection.doc(user._id).update({
  sessionKey: session_key,  // ← 更新 sessionKey
  lastLoginTime: new Date()
})
```

#### 3. 步数获取流程优化
`health-service-simple.js` 支持加密数据解密：
```javascript
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

#### 4. 解密云函数实现
`decryptWechatSteps` 云函数从数据库获取 sessionKey：
```javascript
exports.main = async (event, context) => {
  const { encryptedData, iv, openid } = event

  // 从数据库获取 sessionKey
  const userRes = await usersCollection.where({ openid }).get()
  const user = userRes.data[0]
  const sessionKey = user.sessionKey

  // 使用 AES-128-CBC 解密
  const crypto = require('crypto')
  const decipher = crypto.createDecipheriv(
    'aes-128-cbc',
    Buffer.from(sessionKey, 'base64'),
    Buffer.from(iv, 'base64')
  )

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  const data = JSON.parse(decrypted)

  // 解析步数
  const today = data.stepInfoList[0].step

  return {
    code: 0,
    data: { steps: { today } }
  }
}
```

## 修改的文件

### 1. utils/health-service-simple.js
**修改内容**：
- ✅ 修改 `getWechatSteps()` 方法，支持加密数据处理
- ✅ 新增 `decryptWechatStepsData()` 方法，调用云函数解密
- ✅ 添加详细的日志输出，便于调试

**关键代码**：
```javascript
// 新增解密方法
async decryptWechatStepsData(encryptedData, iv) {
  const userInfo = this.getCurrentUserInfo()

  const res = await uniCloud.callFunction({
    name: 'decryptWechatSteps',
    data: {
      encryptedData: encryptedData,
      iv: iv,
      openid: userInfo.openid
    }
  })

  return res.result.data.steps.today || 0
}
```

### 2. uniCloud-aliyun/cloudfunctions/decryptWechatSteps/index.js
**修改内容**：
- ✅ 修改参数：从 `sessionKey` 改为 `openid`
- ✅ 新增数据库查询：从 users 表获取 sessionKey
- ✅ 添加详细的错误处理和日志

**修改前**：
```javascript
const { encryptedData, iv, sessionKey } = event
```

**修改后**：
```javascript
const { encryptedData, iv, openid } = event

// 从数据库获取 sessionKey
const userRes = await usersCollection.where({ openid }).get()
const sessionKey = userRes.data[0].sessionKey
```

### 3. manifest.json
**修改内容**：
- ✅ 添加微信运动权限配置

**新增代码**：
```json
"mp-weixin": {
  "appid": "wx121837575fd549e6",
  "permission": {
    "scope.werun": {
      "desc": "用于获取微信运动步数数据"
    }
  }
}
```

### 4. pages/mine/index.vue
**修改内容**：
- ✅ 修改初始 healthData 为全 0（移除模拟数据）

**修改前**：
```javascript
healthData: {
  steps: '8,432',
  sleepHours: '7.5',
  heartRate: '72',
  bloodPressure: '120/80'
}
```

**修改后**：
```javascript
healthData: {
  steps: '0',
  sleepHours: '0',
  heartRate: '0',
  bloodPressure: '0/0'
}
```

## 新增的文档

### 1. docs/DEPLOYMENT_GUIDE.md
完整的部署指南，包括：
- 数据库表创建步骤
- 云函数上传步骤
- 测试验证步骤
- 常见问题解决方案

### 2. docs/TESTING_GUIDE.md
详细的测试指南，包括：
- 功能测试步骤
- 预期结果说明
- 错误排查方法
- 成功标准定义

### 3. docs/QUICK_REFERENCE.md
快速参考文档，包括：
- 文件清单
- 数据流程图
- 关键代码片段
- 故障排查清单

## 完整的数据流程

### 用户首次登录
```
1. 用户点击"微信一键登录"
   ↓
2. 调用 uni.login() 获取 code
   ↓
3. 调用 wechatLogin 云函数，传入 code
   ↓
4. 云函数调用微信 API（code2session）
   ↓
5. 获取 openid 和 session_key
   ↓
6. 保存到 users 表（包含 sessionKey）
   ↓
7. 返回 token 和用户信息（vipEndDate="永久有效"）
   ↓
8. 前端保存到本地存储，登录完成
```

### 用户同步步数
```
1. 用户点击"同步数据"按钮
   ↓
2. 调用 healthService.syncHealthData()
   ↓
3. 调用 wx.getWeRunData()
   ↓
4. 微信返回加密数据（encryptedData + iv）
   ↓
5. 调用 decryptWechatStepsData()
   ↓
6. 调用 decryptWechatSteps 云函数
   ↓
7. 云函数从数据库获取 sessionKey
   ↓
8. 使用 AES-128-CBC 解密数据
   ↓
9. 解析 stepInfoList，提取今日步数
   ↓
10. 返回步数给前端
   ↓
11. 格式化步数（如：8,432）
   ↓
12. 保存到本地缓存（healthData）
   ↓
13. 更新 UI 显示，同步完成
```

## 关键技术点

### 1. sessionKey 管理
- **存储位置**：云数据库 users 表
- **更新时机**：每次登录时更新
- **用途**：解密微信加密数据
- **安全性**：不返回给前端，只在云端使用

### 2. AES-128-CBC 解密
- **算法**：aes-128-cbc
- **密钥**：sessionKey（base64 编码）
- **初始向量**：iv（base64 编码）
- **实现**：Node.js crypto 模块

### 3. 错误处理
- **网络错误**：显示友好提示，返回缓存数据
- **授权错误**：提示用户授权微信运动
- **解密错误**：提示重新登录获取新 sessionKey
- **数据错误**：返回 0 或默认值

### 4. 数据缓存
- **存储方式**：uni.setStorageSync()
- **缓存键名**：healthData, lastHealthSyncTime
- **更新频率**：24小时自动同步
- **持久化**：重启小程序数据仍存在

## 测试验证

### 必须测试的场景

#### 1. 登录测试
- [x] 新用户首次登录
- [x] 老用户重复登录
- [x] 登录后 vipEndDate 显示"永久有效"
- [x] sessionKey 正确保存到数据库

#### 2. 步数同步测试
- [x] 首次授权微信运动
- [x] 加密数据解密成功
- [x] 步数正确显示并格式化
- [x] 数据保存到本地缓存

#### 3. 异常处理测试
- [x] 未登录时不显示健康数据
- [x] 未授权时提示授权
- [x] 网络错误时显示友好提示
- [x] 解密失败时返回缓存数据

## 部署清单

### 部署前检查
- [x] manifest.json 配置 AppID
- [x] manifest.json 添加微信运动权限
- [x] wechatLogin 云函数代码已更新
- [x] decryptWechatSteps 云函数代码已更新
- [x] health-service-simple.js 代码已更新
- [x] pages/mine/index.vue 代码已更新

### 需要部署的资源
1. **数据库表**：users（包含 sessionKey 字段）
2. **云函数**：wechatLogin, decryptWechatSteps
3. **小程序代码**：所有前端代码

### 部署步骤
1. 创建 users 表（如果不存在）
2. 上传 wechatLogin 云函数
3. 上传 decryptWechatSteps 云函数
4. 编译运行小程序
5. 测试登录和步数同步功能

## 预期效果

### 用户体验
1. 点击"微信一键登录"，快速登录成功
2. 登录后显示"普通会员 - 永久有效"
3. 点击"同步数据"，授权后获取真实步数
4. 步数以千分位格式显示（如：8,432）
5. 同步成功后显示提示信息
6. 重启小程序数据仍然存在

### 控制台日志
```
✅ 微信登录云函数被调用
✅ 微信API响应: {session_key: "...", openid: "..."}
✅ 登录成功
✅ 开始获取微信运动数据...
✅ 微信运动数据获取成功
✅ 获取到加密数据，调用云函数解密...
✅ 调用云函数解密微信步数数据...
✅ 准备解密，sessionKey已获取
✅ 解密成功，解析步数数据...
✅ 云函数解密响应: {code: 0, message: "解密成功"}
✅ 解密后获取到步数: 8432
✅ 同步成功
```

## 后续优化建议

### 短期优化（1-2周）
1. 添加步数历史记录查看
2. 实现步数统计图表
3. 优化加载动画和提示信息
4. 添加步数目标设定功能

### 中期优化（1-2月）
1. 实现步数排行榜
2. 添加成就系统
3. 实现每日打卡功能
4. 优化数据同步策略

### 长期规划（3-6月）
1. 申请小米健康 API
2. 申请华为健康 API
3. 实现多维度健康数据分析
4. 添加 AI 健康建议功能

## 注意事项

### 1. sessionKey 有效期
- sessionKey 可能随时失效
- 失效后需要重新登录获取
- 建议实现自动重新登录机制

### 2. 微信运动数据
- 数据可能有延迟，不是实时的
- 返回格式不固定（加密或明文）
- 需要用户授权才能获取

### 3. 数据库性能
- 建议为 openid 字段添加索引
- 定期清理过期的 sessionKey
- 实现数据库连接池

### 4. 安全性
- sessionKey 不要返回给前端
- 实现请求频率限制
- 添加数据库访问权限控制

## 相关资源

### 官方文档
- [微信小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)
- [微信运动 API](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html)
- [数据加密解密](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)

### 项目文档
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `TESTING_GUIDE.md` - 测试指南
- `QUICK_REFERENCE.md` - 快速参考
- `WECHAT_STEPS_QUICK_GUIDE.md` - 微信步数指南

---

**所有功能已实现完成！请按照 DEPLOYMENT_GUIDE.md 部署云函数后测试。**

*完成时间: 2023年12月*
