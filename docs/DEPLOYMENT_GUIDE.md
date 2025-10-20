# 微信步数功能部署指南

## 部署前检查清单

### 1. 基础配置
- [x] manifest.json 中已配置 AppID: `wx121837575fd549e6`
- [x] manifest.json 中已添加微信运动权限 `scope.werun`
- [x] 已创建 uniCloud 服务空间（dzzz）

### 2. 代码文件准备
- [x] `uniCloud-aliyun/cloudfunctions/wechatLogin/index.js` - 微信登录云函数
- [x] `uniCloud-aliyun/cloudfunctions/decryptWechatSteps/index.js` - 步数解密云函数
- [x] `uniCloud-aliyun/database/users.schema.json` - 用户数据表结构
- [x] `utils/health-service-simple.js` - 健康服务
- [x] `pages/mine/index.vue` - 个人中心页面
- [x] `pages/mine/login.vue` - 登录页面

## 部署步骤

### 第一步：创建数据库表

1. 打开 HBuilderX
2. 在项目中右键点击 `uniCloud` 目录
3. 选择"打开 uniCloud Web 控制台"
4. 在控制台左侧菜单选择"云数据库"
5. 点击"新建表"

#### 创建 users 表

表名：`users`

字段定义：
```json
{
  "bsonType": "object",
  "required": ["openid"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "openid": {
      "bsonType": "string",
      "description": "微信openid",
      "title": "微信openid"
    },
    "sessionKey": {
      "bsonType": "string",
      "description": "微信会话密钥",
      "title": "会话密钥"
    },
    "name": {
      "bsonType": "string",
      "description": "用户昵称",
      "title": "昵称"
    },
    "avatar": {
      "bsonType": "string",
      "description": "头像URL",
      "title": "头像"
    },
    "phone": {
      "bsonType": "string",
      "description": "手机号",
      "title": "手机号"
    },
    "tagline": {
      "bsonType": "string",
      "description": "个性签名",
      "title": "个性签名"
    },
    "vipLevel": {
      "bsonType": "int",
      "description": "会员等级：1-普通 2-高级 3-VIP",
      "title": "会员等级",
      "defaultValue": 1
    },
    "vipEndDate": {
      "bsonType": "string",
      "description": "会员到期时间",
      "title": "会员到期时间"
    },
    "createTime": {
      "bsonType": "timestamp",
      "description": "创建时间",
      "title": "创建时间",
      "forceDefaultValue": {
        "$env": "now"
      }
    },
    "lastLoginTime": {
      "bsonType": "timestamp",
      "description": "最后登录时间",
      "title": "最后登录时间"
    }
  }
}
```

**重要**：在表权限设置中，暂时设置为"所有用户可读写"（仅用于测试，生产环境需要调整）

### 第二步：上传云函数

#### 2.1 上传 wechatLogin 云函数

1. 在 HBuilderX 中展开 `uniCloud-aliyun/cloudfunctions/` 目录
2. 右键点击 `wechatLogin` 文件夹
3. 选择"上传部署云函数"
4. 等待上传完成，看到"上传成功"提示

**验证**：
- 在 uniCloud Web 控制台左侧选择"云函数"
- 应该能看到 `wechatLogin` 云函数
- 状态为"已部署"

#### 2.2 上传 decryptWechatSteps 云函数

1. 右键点击 `decryptWechatSteps` 文件夹
2. 选择"上传部署云函数"
3. 等待上传完成

**验证**：
- 同样在云函数列表中确认 `decryptWechatSteps` 已部署

### 第三步：测试云函数

#### 测试 wechatLogin 云函数

1. 在 uniCloud Web 控制台选择 `wechatLogin` 云函数
2. 点击"云函数测试"
3. 输入测试参数：
```json
{
  "code": "test_code_123"
}
```
4. 点击"运行"
5. **预期结果**：会返回错误（因为 test_code 无效），但说明云函数可以正常运行

#### 测试 decryptWechatSteps 云函数

1. 选择 `decryptWechatSteps` 云函数
2. 点击"云函数测试"
3. 输入测试参数：
```json
{
  "encryptedData": "test_data",
  "iv": "test_iv",
  "openid": "test_openid"
}
```
4. 点击"运行"
5. **预期结果**：返回"未找到用户信息"（正常，因为用户不存在）

### 第四步：在小程序中测试完整流程

#### 4.1 编译小程序

1. 在 HBuilderX 中点击"运行" > "运行到小程序模拟器" > "微信开发者工具"
2. 等待编译完成
3. 微信开发者工具会自动打开

#### 4.2 测试登录功能

1. 在微信开发者工具中打开小程序
2. 点击底部 tab "我的"
3. 点击"登录 / 注册"按钮
4. 点击"微信一键登录"

**预期结果**：
- 登录成功
- 显示用户信息
- 显示"普通会员 - 永久有效"
- 显示健康数据卡片（初始数据为0）

**检查控制台日志**：
```
微信登录云函数被调用: {code: "..."}
微信API响应: {session_key: "...", openid: "..."}
登录成功
```

**检查数据库**：
- 在 uniCloud Web 控制台打开 `users` 表
- 应该能看到新创建的用户记录
- `openid` 和 `sessionKey` 字段已保存
- `vipEndDate` 为 "永久有效"

#### 4.3 测试微信步数同步

1. 登录成功后，在"我的"页面
2. 点击"同步数据"按钮

**预期结果**：
- 显示"同步中..."加载提示
- （第一次）弹出微信运动授权提示，点击"允许"
- 调用云函数解密步数数据
- 显示"同步成功"提示
- 步数数据更新显示

**检查控制台日志**：
```
当前平台: devtools
开始获取微信运动数据...
微信运动数据获取成功: {encryptedData: "...", iv: "..."}
获取到加密数据，调用云函数解密...
调用云函数解密微信步数数据...
云函数解密响应: {result: {code: 0, message: "解密成功", data: {...}}}
解密后获取到步数: 8432
```

**检查本地存储**：
- 在微信开发者工具的"Storage"标签
- 查看 `healthData` 键
- 应该显示步数数据

## 常见部署问题

### Q1: 上传云函数失败

**可能原因**：
- 未绑定服务空间
- 网络连接问题

**解决方法**：
1. 右键点击 `uniCloud` 目录
2. 选择"关联云服务空间"
3. 选择 `dzzz` 服务空间
4. 重新上传云函数

### Q2: 云函数运行报错 "Cannot find module 'crypto'"

**原因**：crypto 是 Node.js 内置模块，应该可用

**解决方法**：
- 检查云函数环境是否正常
- 在云函数根目录运行 `npm install`（如果需要）

### Q3: 数据库操作失败

**可能原因**：
- 表不存在
- 权限配置错误

**解决方法**：
1. 确认 `users` 表已创建
2. 检查表权限设置
3. 查看云函数日志获取详细错误

### Q4: 解密失败 "未找到 sessionKey"

**原因**：用户登录时 sessionKey 未保存到数据库

**解决方法**：
1. 删除小程序本地存储（Storage 标签中清空）
2. 重新登录
3. 确认 `wechatLogin` 云函数正确保存了 sessionKey

### Q5: 微信开发者工具中步数显示为 0

**可能原因**：
- 开发者工具中微信运动 API 模拟数据为空
- 未授权微信运动权限

**解决方法**：
1. 使用真机测试（扫码预览）
2. 确认手机微信有运动数据
3. 确认已授权微信运动

## 真机测试

### 准备工作
1. 确保手机安装微信
2. 手机微信中有运动数据
3. 小程序已上传到微信后台（开发版）

### 测试步骤
1. 在 HBuilderX 中点击"发行" > "小程序-微信"
2. 在微信公众平台上传代码
3. 设置为体验版
4. 手机微信扫码体验版二维码
5. 打开小程序，测试登录和步数同步

### 预期结果
- 登录成功
- 授权微信运动后能获取到真实步数
- 数据保存到本地缓存
- 重新打开小程序数据仍然存在

## 性能优化建议

### 1. 云函数优化
- 添加云函数缓存
- 优化数据库查询（添加索引）
- 实现请求去重

### 2. 数据同步优化
- 实现智能同步（24小时自动同步）
- 添加数据验证和容错
- 实现离线数据缓存

### 3. 安全优化
- 配置数据库权限规则
- 实现 token 验证机制
- 添加请求频率限制

## 生产环境部署清单

部署到生产环境前，确保：

- [ ] 所有云函数已上传并测试通过
- [ ] 数据库表已创建并配置权限
- [ ] 微信小程序已提交审核
- [ ] 已在真机上完整测试所有功能
- [ ] 已配置错误监控和日志
- [ ] 已准备应急回滚方案
- [ ] 已通知用户更新说明

## 后续优化方向

### 短期
1. 实现历史步数数据查看
2. 添加步数排行榜
3. 实现步数目标设定

### 长期
1. 接入小米健康 API
2. 接入华为健康 API
3. 实现多维度健康数据分析
4. 添加健康建议功能

---

**部署完成后，请参考 `TESTING_GUIDE.md` 进行完整的功能测试！**

*最后更新: 2023年12月*
