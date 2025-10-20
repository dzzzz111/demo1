# 微信一键登录配置指南

## 概述
本应用已集成微信一键登录功能，通过uniCloud云函数实现用户授权和身份验证。

## 配置步骤

### 1. 微信小程序后台配置

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 选择你的小程序
3. 进入"开发" → "开发管理" → "开发设置"
4. 记录以下信息：
   - AppID（小程序ID）
   - AppSecret（小程序密钥）

### 2. uniCloud配置

#### 2.1 上传云函数
1. 在HBuilderX中右键点击 `uniCloud-aliyun/cloudfunctions/wechatLogin` 目录
2. 选择"上传云函数"
3. 等待上传完成

#### 2.2 配置云函数环境变量
1. 在uniCloud控制台找到 `wechatLogin` 云函数
2. 添加环境变量：
   - `WECHAT_APPID`: 你的微信小程序AppID
   - `WECHAT_APPSECRET`: 你的微信小程序AppSecret

#### 2.3 创建数据库表
1. 在uniCloud控制台创建数据库表 `users`
2. 导入或应用 `uniCloud-aliyun/database/users.schema.json` 表结构

### 3. 小程序配置

#### 3.1 配置服务器域名
在微信小程序后台配置以下服务器域名：
- request合法域名：`https://api.weixin.qq.com`

#### 3.2 权限配置
在 `app.json` 中确保包含以下权限：
```json
{
  "permission": {
    "scope.userInfo": {
      "desc": "用于获取用户信息进行登录"
    }
  }
}
```

## 功能说明

### 登录流程
1. 用户点击"微信一键登录"按钮
2. 应用调用 `uni.login()` 获取微信授权码
3. 授权码上传到云函数
4. 云函数调用微信API获取openid和session_key
5. 查询或创建用户记录
6. 返回用户信息和登录token

### 数据结构
用户信息存储在 `users` 表中，包含以下字段：
- `openid`: 微信用户唯一标识
- `sessionKey`: 微信会话密钥
- `name`: 用户昵称
- `avatar`: 用户头像
- `phone`: 手机号（可选）
- `createTime`: 创建时间
- `lastLoginTime`: 最后登录时间
- `tagline`: 个人签名
- `vipLevel`: VIP等级
- `vipEndDate`: VIP到期时间

## 测试方法

1. 在微信开发者工具中打开项目
2. 点击登录页面的"微信一键登录"按钮
3. 查看控制台日志，确认：
   - 微信授权码获取成功
   - 云函数调用成功
   - 用户信息正确保存
4. 验证登录后用户信息正确显示

## 故障排除

### 常见问题

1. **"获取微信授权码失败"**
   - 检查小程序是否在微信开发者工具中运行
   - 确认已配置正确的小程序AppID

2. **"微信登录失败: invalid appid"**
   - 检查云函数环境变量中的AppID是否正确
   - 确认AppID没有多余的空格

3. **"微信登录失败: invalid code"**
   - 授权码可能已过期，重新尝试登录
   - 检查网络连接是否正常

4. **云函数调用失败**
   - 确认云函数已上传成功
   - 检查uniCloud服务空间配置是否正确

## 安全注意事项

1. **AppSecret安全**
   - 不要在前端代码中暴露AppSecret
   - 使用云函数环境变量存储敏感信息
   - 定期更换AppSecret

2. **数据安全**
   - 用户openid应加密存储
   - sessionKey不应返回给前端
   - 定期清理过期的sessionKey

3. **登录安全**
   - 实现登录token过期机制
   - 添加登录失败次数限制
   - 记录登录日志用于安全审计

## 扩展功能

后续可以考虑添加以下功能：

1. **获取用户信息**
   ```javascript
   uni.getUserProfile({
     desc: '用于完善会员资料',
     success: (res) => {
       console.log('用户信息:', res.userInfo)
     }
   })
   ```

2. **手机号绑定**
   ```javascript
   uni.getPhoneNumber({
     success: (res) => {
       console.log('手机号加密数据:', res.encryptedData)
     }
   })
   ```

3. **微信支付集成**
   - 配置微信支付参数
   - 实现支付接口调用

## 联系支持

如果在配置过程中遇到问题，请：
1. 查看控制台日志信息
2. 检查本文档的故障排除部分
3. 联系技术支持团队