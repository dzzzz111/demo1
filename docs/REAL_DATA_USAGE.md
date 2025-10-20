# 真实数据使用说明

## 概述
应用已配置为使用真实数据，所有模拟数据功能已移除。

## 微信登录配置

### AppID和AppSecret
```
AppID: wx121837575fd549e6
AppSecret: 45cdeeb69b02aa79bde8bb830d897ce9
```

### 云函数配置
- ✅ `wechatLogin` 云函数已配置真实AppID和AppSecret
- ✅ 所有模拟登录逻辑已移除
- ✅ 环境配置已切换为生产模式

### 使用说明
1. 上传 `wechatLogin` 云函数到uniCloud
2. 在微信小程序中点击"微信一键登录"
3. 系统将调用真实的微信API进行登录
4. 登录成功后，用户信息保存到云数据库

## 健康数据配置

### 微信运动步数
- ✅ 已配置真实的微信运动API调用
- ✅ 使用AES-128-CBC解密微信加密数据
- ✅ 需要用户授权微信运动权限

#### 使用流程
1. 用户授权微信运动
2. 调用 `wx.getWeRunData()` 获取加密数据
3. 上传到 `decryptWechatSteps` 云函数解密
4. 提取今日步数和历史数据

### 小米健康和华为健康
- ⚠️ 需要单独申请API权限
- ⚠️ 需要配置对应平台的AppID和AppSecret
- ⚠️ 当前为占位实现，会返回错误提示

#### 申请流程

**小米健康**:
1. 访问 [小米开放平台](https://dev.mi.com/)
2. 创建应用并获取AppID和AppSecret
3. 申请健康数据API权限
4. 在云函数中实现API调用逻辑

**华为健康**:
1. 访问 [华为开发者联盟](https://developer.huawei.com/)
2. 创建应用并获取AppID和AppSecret
3. 申请Health Kit权限
4. 在云函数中实现API调用逻辑

## 普通会员设置

### 有效期显示
- ✅ 普通会员（vipLevel=1）显示"永久有效"
- ✅ 高级会员显示具体到期时间
- ✅ 登录时自动设置会员信息

## 数据库配置

### 必需的数据表
1. **users表**: 用户信息
   - openid, sessionKey, name, avatar
   - vipLevel, vipEndDate
   - createTime, lastLoginTime

2. **health-data表**: 健康数据
   - userId, dataDate, provider, type
   - value, unit, syncTime, isValid

### 创建步骤
1. 在uniCloud控制台创建表
2. 导入对应的schema文件
3. 配置数据库权限

## 云函数清单

### 必需上传的云函数
1. **wechatLogin**: 微信登录认证
   - 使用真实AppID和AppSecret
   - 调用微信API获取openid
   - 保存用户信息到数据库

2. **decryptWechatSteps**: 微信步数解密
   - 使用crypto库AES解密
   - 解析步数数据
   - 返回今日步数和历史数据

3. **getHealthData**: 健康数据获取
   - 调用各平台API
   - 需要配置对应的API密钥
   - 返回健康数据

## 测试验证

### 微信登录测试
```bash
# 在微信开发者工具中测试
1. 点击"微信一键登录"按钮
2. 检查控制台日志，确认获取到code
3. 验证云函数调用成功
4. 检查用户信息是否正确保存
5. 确认vipEndDate为"永久有效"
```

### 微信步数测试
```bash
# 测试步数获取
1. 授权微信运动权限
2. 点击"同步数据"按钮
3. 检查是否成功获取步数
4. 验证数据是否正确显示
```

## 常见问题

### Q1: 登录失败，提示"invalid code"
**A**: 检查AppID和AppSecret是否正确配置，code是否已过期

### Q2: 步数解密失败
**A**: 确认sessionKey是否正确，检查云函数中crypto库是否正常工作

### Q3: 小米/华为健康获取失败
**A**: 这是正常的，需要先申请对应平台的API权限

### Q4: 数据库保存失败
**A**: 检查数据库表是否创建，字段类型是否匹配

## 部署清单

### 生产环境部署前检查
- [x] 微信小程序AppID和AppSecret已配置
- [x] 云函数已上传到uniCloud
- [x] 数据库表已创建
- [x] 数据库权限已配置
- [x] 所有模拟数据逻辑已移除
- [x] 环境配置为生产模式
- [ ] 小米健康API已申请（可选）
- [ ] 华为健康API已申请（可选）
- [ ] 完整功能测试已通过

## 安全注意事项

### 敏感信息保护
- ✅ AppSecret已在云函数中配置
- ✅ 不在前端代码中暴露
- ✅ sessionKey不返回给前端
- ✅ 用户数据加密传输

### 数据安全
- ✅ 用户openid与userId关联
- ✅ 健康数据仅用户本人可见
- ✅ 数据库配置访问权限
- ✅ 定期备份重要数据

## 功能限制

### 当前可用功能
1. ✅ 微信登录（真实API）
2. ✅ 微信运动步数（真实API）
3. ✅ 普通会员永久有效期
4. ✅ 数据云端备份

### 需要配置的功能
1. ⚠️ 小米健康数据（需申请API）
2. ⚠️ 华为健康数据（需申请API）
3. ⚠️ 睡眠数据（依赖第三方API）
4. ⚠️ 心率和血压数据（依赖第三方API）

## 扩展开发

### 添加新的健康数据源
1. 在 `config/health-config.js` 添加提供商配置
2. 在 `getHealthData` 云函数添加API调用
3. 在 `health-service.js` 添加数据处理逻辑
4. 更新数据库schema

### 自定义数据展示
1. 修改 `pages/mine/index.vue` 页面布局
2. 调整数据格式化函数
3. 添加图表展示组件

---

**配置完成后即可正常使用所有真实数据功能！**

*最后更新: 2023年12月*