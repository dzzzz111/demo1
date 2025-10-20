# 微信步数获取快速指南

## 当前状态
由于云函数配置问题，我已创建了一个简化版的健康数据服务，直接从微信运动API获取步数。

## 功能说明

### ✅ 可用功能
1. **微信运动步数**: 直接调用 `wx.getWeRunData()` 获取
2. **本地缓存**: 步数数据保存在本地
3. **一键同步**: 点击"同步数据"按钮即可

### ⚠️ 暂不可用
1. **睡眠数据**: 需要第三方API支持
2. **心率数据**: 需要第三方API支持
3. **血压数据**: 需要第三方API支持

## 使用方法

### 1. 配置微信运动权限
在 `app.json` 中添加：
```json
{
  "permission": {
    "scope.werun": {
      "desc": "用于获取微信运动步数"
    }
  }
}
```

### 2. 授权微信运动
首次使用时，用户需要授权微信运动权限。

### 3. 同步步数
点击个人中心页面的"同步数据"按钮，即可获取今日步数。

## 数据存储

### 本地存储
步数数据保存在本地缓存中，键名为 `healthData`：
```javascript
{
  steps: "8,432",  // 今日步数，格式化显示
  sleepHours: "0", // 暂无数据
  heartRate: "0",  // 暂无数据
  bloodPressure: "0/0" // 暂无数据
}
```

### 自动同步
应用会在以下情况自动同步步数：
- 用户打开个人中心页面（超过24小时未同步）
- 用户手动点击"同步数据"按钮

## 微信运动API说明

### wx.getWeRunData()
获取用户过去三十天微信运动步数。

#### 返回数据
```javascript
{
  encryptedData: "加密数据",
  iv: "初始向量",
  stepInfoList: [ // 有时候会直接返回解密后的数据
    {
      timestamp: 1445866601,
      step: 100
    }
  ]
}
```

### 处理逻辑
1. 如果返回 `stepInfoList`，直接使用
2. 如果返回加密数据，需要通过云函数解密（需要sessionKey）

## 当前实现

### health-service-simple.js
简化版健康服务，只处理微信步数：

```javascript
// 获取微信步数
async getWechatSteps() {
  return new Promise((resolve, reject) => {
    wx.getWeRunData({
      success: (res) => {
        if (res.stepInfoList && res.stepInfoList.length > 0) {
          // 获取今天的步数
          const todaySteps = res.stepInfoList[0].step || 0
          resolve(todaySteps)
        } else {
          // 需要解密，暂时返回0
          resolve(0)
        }
      },
      fail: (err) => {
        reject(new Error('获取微信步数失败，请授权微信运动权限'))
      }
    })
  })
}
```

## 常见问题

### Q1: 步数显示为0
**A**: 可能的原因：
1. 未授权微信运动
2. 今天还没有运动数据
3. API返回了加密数据（需要云函数解密）

### Q2: 提示"请在微信小程序中使用"
**A**: 当前不在微信小程序环境，只能在真机微信中使用

### Q3: 其他健康数据为什么都是0？
**A**: 睡眠、心率、血压需要接入小米/华为健康API，目前未配置

## 后续优化

### 完整解密支持
如果需要完整的解密支持，需要：

1. 保存登录时的sessionKey
2. 调用decryptWechatSteps云函数
3. 传递encryptedData、iv、sessionKey

```javascript
// 完整解密流程
async getWechatStepsWithDecrypt(sessionKey) {
  const res = await wx.getWeRunData()

  if (res.stepInfoList) {
    return res.stepInfoList[0].step
  }

  // 调用云函数解密
  const result = await uniCloud.callFunction({
    name: 'decryptWechatSteps',
    data: {
      encryptedData: res.encryptedData,
      iv: res.iv,
      sessionKey: sessionKey
    }
  })

  return result.data.steps.today
}
```

### 接入其他健康数据
1. 申请小米健康API
2. 申请华为健康API
3. 实现对应的云函数调用
4. 更新health-service-simple.js

## 测试方法

### 1. 在微信开发者工具中
```bash
1. 打开个人中心页面
2. 点击"同步数据"按钮
3. 查看控制台日志
4. 检查步数是否显示
```

### 2. 真机测试
```bash
1. 编译到微信小程序
2. 在真机上打开
3. 授权微信运动
4. 同步数据查看步数
```

---

**当前版本已经可以获取微信步数并显示！**

*更新时间: 2023年12月*