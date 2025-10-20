# 健康数据接入指南

## 概述
本应用已集成多平台健康数据获取功能，支持微信运动、小米健康、华为健康等平台的数据同步。

## 功能特点

### ✅ 已实现功能
- **微信运动步数**: 自动获取每日步数数据
- **小米健康数据**: 支持睡眠、心率、血压数据
- **华为健康数据**: 支持睡眠、心率、血压数据
- **本地缓存**: 智能缓存，减少网络请求
- **自动同步**: 每日自动同步健康数据
- **数据合并**: 智能合并多平台数据
- **云数据库**: 数据云端备份

### 🔄 数据同步策略
- **优先级**: 小米 > 华为 > 微信 > 手动
- **频率**: 24小时自动同步一次
- **缓存**: 本地缓存12小时
- **重试**: 同步失败自动重试3次

## 配置步骤

### 1. 上传云函数
需要上传以下云函数到uniCloud：

```bash
# 获取健康数据
uniCloud-aliyun/cloudfunctions/getHealthData

# 解密微信步数
uniCloud-aliyun/cloudfunctions/decryptWechatSteps
```

### 2. 创建数据库表
在uniCloud控制台创建 `health-data` 表，导入schema文件：
`uniCloud-aliyun/database/health-data.schema.json`

### 3. 配置健康服务
应用已自动配置健康服务，包含以下功能：
- 多平台数据获取
- 智能数据合并
- 本地缓存管理
- 自动同步机制

## 平台接入详情

### 微信运动接入

#### 必需配置
```javascript
// 在app.json中添加权限
{
  "permission": {
    "scope.werun": {
      "desc": "用于获取微信运动步数"
    }
  }
}
```

#### 接入流程
1. 用户授权微信运动
2. 调用 `wx.getWeRunData()` 获取加密数据
3. 云函数解密数据
4. 提取步数信息

#### API调用示例
```javascript
// 获取微信运动数据
wx.getWeRunData({
  success: (res) => {
    console.log('微信运动数据:', res.encryptedData);

    // 调用云函数解密
    uniCloud.callFunction({
      name: 'decryptWechatSteps',
      data: {
        encryptedData: res.encryptedData,
        iv: res.iv,
        sessionKey: sessionKey
      }
    });
  }
});
```

### 小米健康接入

#### 开发者申请
1. 访问 [小米开放平台](https://dev.mi.com/)
2. 创建应用获取AppID和AppSecret
3. 申请健康数据API权限
4. 配置回调域名

#### API集成
```javascript
// 小米健康API示例（云函数中实现）
const xiaomiApi = {
  endpoint: 'https://api.mi.com/health',

  // 获取睡眠数据
  getSleepData: async (userId, date) => {
    // 调用小米健康API
  },

  // 获取心率数据
  getHeartRateData: async (userId, date) => {
    // 调用小米健康API
  },

  // 获取血压数据
  getBloodPressureData: async (userId, date) => {
    // 调用小米健康API
  }
};
```

### 华为健康接入

#### 开发者申请
1. 访问 [华为开发者联盟](https://developer.huawei.com/)
2. 创建应用获取AppID和AppSecret
3. 申请Health Kit权限
4. 配置应用签名

#### API集成
```javascript
// 华为健康API示例（云函数中实现）
const huaweiApi = {
  endpoint: 'https://health.huawei.com/api',

  // 获取睡眠数据
  getSleepData: async (userId, date) => {
    // 调用华为健康API
  },

  // 获取心率数据
  getHeartRateData: async (userId, date) => {
    // 调用华为健康API
  },

  // 获取血压数据
  getBloodPressureData: async (userId, date) => {
    // 调用华为健康API
  }
};
```

## 数据结构

### 健康数据模型
```javascript
{
  // 步数
  steps: "8,432",

  // 睡眠时长（小时）
  sleepHours: "7.5",

  // 心率（次/分）
  heartRate: "72",

  // 血压（收缩压/舒张压）
  bloodPressure: "120/80"
}
```

### 云数据库结构
```javascript
{
  userId: "用户ID",
  dataDate: "2023-12-01",
  provider: "xiaomi|huawei|wechat|manual",
  type: "steps|sleep|heartRate|bloodPressure",
  value: "数值",
  unit: "单位",
  syncTime: "同步时间",
  isValid: "数据是否有效"
}
```

## 使用指南

### 1. 手动同步
用户可以点击"同步数据"按钮立即同步所有平台的健康数据。

### 2. 自动同步
应用会在以下情况自动同步：
- 用户打开应用时（超过24小时未同步）
- 每日固定时间（可配置）

### 3. 数据查看
用户可以在个人中心查看：
- 今日步数
- 睡眠时长
- 心率数据
- 血压数据

## 开发配置

### 环境变量配置
在uniCloud控制台为云函数配置环境变量：

```bash
# 小米健康配置
XIAOMI_APP_ID=your_xiaomi_app_id
XIAOMI_APP_SECRET=your_xiaomi_app_secret

# 华为健康配置
HUAWEI_APP_ID=your_huawei_app_id
HUAWEI_APP_SECRET=your_huawei_app_secret
```

### 健康配置文件
修改 `config/health-config.js` 自定义配置：

```javascript
export default {
  // 支持的提供商
  providers: {
    xiaomi: { ... },
    huawei: { ... },
    wechat: { ... }
  },

  // 同步配置
  sync: {
    autoSyncInterval: 24 * 60 * 60 * 1000, // 24小时
    maxRetries: 3,
    timeout: 10000
  }
}
```

## 测试方法

### 1. 开发环境测试
```bash
# 在HBuilderX中运行项目
# 点击"同步数据"按钮
# 查看控制台日志
```

### 2. 真机测试
- 微信环境：测试微信运动授权和数据获取
- 小米手机：测试小米健康数据同步
- 华为手机：测试华为健康数据同步

### 3. 云函数测试
```bash
# 在uniCloud控制台测试云函数
getHealthData({
  provider: "xiaomi",
  type: ["sleep", "heartRate", "bloodPressure"]
})
```

## 故障排除

### 常见问题

#### 1. 微信运动授权失败
```
错误: getWeRunData:fail no permission
解决: 检查app.json中是否配置了werun权限
```

#### 2. 云函数调用失败
```
错误: function not found
解决: 确认云函数已上传成功
```

#### 3. 数据获取失败
```
错误: API调用超时
解决: 检查网络连接和API配置
```

#### 4. 数据不更新
```
错误: 数据缓存时间过长
解决: 清除本地缓存或手动同步
```

### 调试方法

#### 1. 启用调试日志
```javascript
// 在health-service.js中启用详细日志
console.log('健康数据同步开始:', provider);
```

#### 2. 检查本地存储
```javascript
// 检查健康数据缓存
const healthData = uni.getStorageSync('healthData');
console.log('本地健康数据:', healthData);
```

#### 3. 查看云函数日志
在uniCloud控制台查看云函数执行日志。

## 隐私和安全

### 数据保护
- 所有健康数据都经过加密传输
- 本地存储使用安全的存储机制
- 云数据库配置了访问权限控制

### 用户授权
- 明确告知用户数据用途
- 提供授权撤销功能
- 支持数据删除请求

### 合规要求
- 遵循《个人信息保护法》
- 符合微信小程序规范
- 满足健康数据隐私要求

## 扩展功能

### 计划中的功能
1. **更多平台支持**: Apple Health、Fitbit等
2. **数据分析**: 健康趋势分析、异常提醒
3. **数据导出**: 支持CSV、PDF格式导出
4. **健康报告**: 定期生成健康报告
5. **分享功能**: 健康数据分享到社交媒体

### 自定义扩展
开发者可以轻松添加新的健康数据提供商：

1. 在 `health-config.js` 中添加提供商配置
2. 在 `getHealthData` 云函数中添加API调用逻辑
3. 在 `health-service.js` 中添加数据处理方法

## 技术支持

如遇到问题，请：
1. 查看本文档的故障排除部分
2. 检查控制台日志信息
3. 联系技术支持团队

---

*最后更新: 2023年12月*