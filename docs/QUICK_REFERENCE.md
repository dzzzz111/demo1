# 微信步数功能快速参考

## 当前实现状态

### ✅ 已完成功能
1. **微信登录** - 使用真实 AppID 和 AppSecret
2. **普通会员永久有效** - vipLevel=1 显示"永久有效"
3. **微信步数获取** - 支持加密数据解密
4. **本地缓存** - 步数数据保存到本地
5. **自动同步** - 24小时自动同步机制

### ⚠️ 暂不可用
1. **小米健康数据** - 需要申请 API
2. **华为健康数据** - 需要申请 API
3. **睡眠/心率/血压** - 依赖第三方 API

## 关键文件清单

### 前端代码
```
pages/mine/login.vue           - 登录页面（已移除验证码登录）
pages/mine/index.vue           - 个人中心页面（健康数据展示）
utils/health-service-simple.js - 健康服务（支持加密数据解密）
config/health-config.js        - 健康数据配置
manifest.json                  - 小程序配置（已添加微信运动权限）
```

### 云函数
```
uniCloud-aliyun/cloudfunctions/wechatLogin/index.js
  - 微信登录
  - 保存 sessionKey 到数据库
  - 设置普通会员为永久有效

uniCloud-aliyun/cloudfunctions/decryptWechatSteps/index.js
  - 从数据库获取 sessionKey
  - 解密微信运动加密数据
  - 返回今日步数
```

### 数据库
```
users 表
  - openid: 微信 openid
  - sessionKey: 微信会话密钥（用于解密）
  - name, avatar, phone: 用户信息
  - vipLevel: 会员等级（1=普通）
  - vipEndDate: 会员到期时间（普通会员为"永久有效"）
```

## 数据流程图

### 登录流程
```
用户点击登录
    ↓
调用 uni.login() 获取 code
    ↓
调用 wechatLogin 云函数
    ↓
云函数调用微信 API（code2session）
    ↓
获取 openid 和 session_key
    ↓
保存到 users 表
    ↓
返回 token 和用户信息
    ↓
前端保存到本地存储
```

### 步数同步流程
```
用户点击"同步数据"
    ↓
调用 wx.getWeRunData()
    ↓
微信返回加密数据（encryptedData + iv）
    ↓
调用 decryptWechatSteps 云函数
    ↓
云函数从数据库获取 sessionKey
    ↓
使用 AES-128-CBC 解密数据
    ↓
解析步数数据
    ↓
返回今日步数
    ↓
前端格式化并保存到本地缓存
    ↓
更新 UI 显示
```

## 关键代码片段

### 1. 微信登录（login.vue）
```javascript
wechatLogin() {
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      if (loginRes.code) {
        this.callWechatLoginCloudFunction(loginRes.code);
      }
    }
  });
}
```

### 2. 同步步数（index.vue）
```javascript
async syncHealthData(showLoading = true) {
  const healthData = await healthService.syncHealthData(showLoading);
  this.healthData = healthData;
}
```

### 3. 获取微信步数（health-service-simple.js）
```javascript
async getWechatSteps() {
  return new Promise(async (resolve, reject) => {
    wx.getWeRunData({
      success: async (res) => {
        if (res.stepInfoList && res.stepInfoList.length > 0) {
          // 直接返回步数
          resolve(res.stepInfoList[0].step || 0)
        } else if (res.encryptedData && res.iv) {
          // 调用云函数解密
          const steps = await this.decryptWechatStepsData(res.encryptedData, res.iv)
          resolve(steps)
        }
      },
      fail: (err) => reject(new Error('获取失败'))
    })
  })
}
```

### 4. 解密云函数（decryptWechatSteps/index.js）
```javascript
exports.main = async (event, context) => {
  const { encryptedData, iv, openid } = event

  // 从数据库获取 sessionKey
  const user = await usersCollection.where({ openid }).get()
  const sessionKey = user.data[0].sessionKey

  // 解密
  const decryptedData = decryptWechatData(encryptedData, iv, sessionKey)

  // 解析步数
  const stepsData = parseStepsData(decryptedData)

  return {
    code: 0,
    data: { steps: stepsData }
  }
}
```

## 配置信息

### 微信小程序
```
AppID: wx121837575fd549e6
AppSecret: 45cdeeb69b02aa79bde8bb830d897ce9
```

### uniCloud 服务空间
```
名称: dzzz
SpaceId: mp-aec6565b-c333-4030-8492-6cc423e8ca1a
服务商: 阿里云
```

## 部署步骤（简化版）

### 1. 创建数据库
- 在 uniCloud 控制台创建 `users` 表
- 包含字段：openid, sessionKey, name, avatar, vipLevel, vipEndDate

### 2. 上传云函数
```
右键点击云函数文件夹 → 上传部署云函数
- wechatLogin
- decryptWechatSteps
```

### 3. 编译运行
```
运行 → 运行到小程序模拟器 → 微信开发者工具
```

### 4. 测试功能
```
1. 测试登录 → 应显示"永久有效"
2. 测试同步 → 应获取到步数
3. 检查缓存 → Storage 中应有 healthData
```

## 故障排查

### 登录失败
```
检查项：
□ AppID 和 AppSecret 是否正确
□ code 是否有效（5分钟过期）
□ 云函数是否已上传
□ users 表是否已创建
```

### 步数为 0
```
检查项：
□ 是否授权微信运动
□ 微信中是否有运动数据
□ sessionKey 是否已保存
□ 云函数解密是否成功
```

### 解密失败
```
检查项：
□ openid 是否正确
□ sessionKey 是否存在
□ encryptedData 和 iv 是否有效
□ crypto 模块是否正常
```

## 控制台日志关键词

### 成功的日志
```
✅ "微信登录云函数被调用"
✅ "微信API响应"
✅ "登录成功"
✅ "开始获取微信运动数据"
✅ "微信运动数据获取成功"
✅ "调用云函数解密"
✅ "解密成功"
✅ "解密后获取到步数: 8432"
```

### 错误的日志
```
❌ "invalid code" → code 无效，重新登录
❌ "auth deny" → 未授权，需要用户授权
❌ "未找到用户信息" → 用户不存在，重新登录
❌ "未找到 sessionKey" → sessionKey 丢失，重新登录
❌ "解密失败" → sessionKey 可能过期，重新登录
```

## 本地存储结构

### Storage 键值
```javascript
{
  "token": "token_xxx_1234567890",
  "userInfo": {
    "userId": "xxx",
    "openid": "xxx",
    "name": "微信用户",
    "vipLevel": 1,
    "vipEndDate": "永久有效"
  },
  "healthData": {
    "steps": "8,432",
    "sleepHours": "0",
    "heartRate": "0",
    "bloodPressure": "0/0"
  },
  "lastHealthSyncTime": 1234567890000
}
```

## API 限制说明

### 微信运动 API
- **权限要求**: scope.werun
- **数据范围**: 最近 30 天
- **更新频率**: 实时（但有延迟）
- **返回格式**: 加密或明文（随机）

### sessionKey 说明
- **有效期**: 不确定，可能随时失效
- **用途**: 解密微信加密数据
- **存储**: 保存在云数据库 users 表
- **更新**: 每次登录时更新

## 下一步开发建议

### 优先级 1（当前需要）
- [ ] 确保云函数已上传
- [ ] 测试完整登录流程
- [ ] 验证步数解密功能
- [ ] 确认数据持久化

### 优先级 2（短期优化）
- [ ] 添加步数历史记录
- [ ] 实现数据图表展示
- [ ] 优化错误提示信息
- [ ] 添加加载状态动画

### 优先级 3（长期规划）
- [ ] 申请小米健康 API
- [ ] 申请华为健康 API
- [ ] 实现多数据源整合
- [ ] 添加健康分析功能

## 相关文档

- `DEPLOYMENT_GUIDE.md` - 详细部署指南
- `TESTING_GUIDE.md` - 测试指南
- `WECHAT_STEPS_QUICK_GUIDE.md` - 微信步数快速指南
- `REAL_DATA_USAGE.md` - 真实数据使用说明

---

**如有问题，请先查看控制台日志！**

*最后更新: 2023年12月*
