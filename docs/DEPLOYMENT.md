# 医疗助手应用部署指南

## 项目概述

这是一个基于UniApp开发的医疗助手应用，提供AI智能问诊、图像诊断等功能。应用支持多平台部署，包括微信小程序、H5、Android和iOS。

## 环境要求

### 开发环境
- HBuilderX IDE (推荐最新版本)
- Node.js 14+ (用于依赖管理)
- 微信开发者工具 (小程序开发)
- Android Studio (Android开发)
- Xcode (iOS开发)

### 依赖项
- axios: ^1.11.0 (HTTP请求库)

## 部署步骤

### 1. 环境准备

#### 1.1 安装HBuilderX
1. 下载并安装HBuilderX IDE
2. 安装必要的插件：
   - UniApp编译器
   - 微信小程序开发工具
   - 各平台打包工具

#### 1.2 项目初始化
```bash
# 克隆项目
git clone [项目地址]
cd yd

# 安装依赖
npm install
```

### 2. 配置文件设置

#### 2.1 AI服务配置
编辑 `config/ai-config.js` 文件：

```javascript
const CURRENT_CONFIG = 'ALIYUN_BAILIAN'; // 或其他AI服务

const AI_CONFIGS = {
  ALIYUN_BAILIAN: {
    appId: 'your-app-id',
    apiKey: 'your-api-key',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/apps',
    modelName: 'qwen-max',
    enableThoughts: true,
    streamOutput: true
  }
  // 其他AI服务配置...
};
```

#### 2.2 应用配置
编辑 `manifest.json` 文件：

- 修改应用ID (appid)
- 配置各平台权限
- 设置应用图标和启动页

### 3. 多平台部署

#### 3.1 微信小程序部署
1. **获取小程序AppID**
   - 在微信公众平台注册小程序
   - 获取AppID并配置到 `manifest.json` 的 `mp-weixin` 部分

2. **编译小程序**
   - 在HBuilderX中选择"发行" → "小程序-微信"
   - 等待编译完成

3. **上传和发布**
   - 打开微信开发者工具
   - 导入编译后的小程序项目
   - 点击"上传"按钮
   - 在微信公众平台提交审核

#### 3.2 H5网页部署
1. **编译H5**
   - 在HBuilderX中选择"发行" → "网站-H5手机版"
   - 等待编译完成

2. **部署到服务器**
   - 将 `unpackage/dist/build/h5` 目录下的文件上传到Web服务器
   - 配置HTTPS证书（小程序要求）
   - 确保服务器支持跨域请求

#### 3.3 Android应用部署
1. **准备Android证书**
   - 生成Android签名证书
   - 配置到 `manifest.json` 的 `app-plus` 部分

2. **编译APK**
   - 在HBuilderX中选择"发行" → "原生App-云打包"
   - 选择Android平台
   - 等待打包完成

3. **发布到应用商店**
   - 注册Google Play开发者账号
   - 上传APK文件
   - 填写应用信息和隐私政策
   - 提交审核

#### 3.4 iOS应用部署
1. **准备iOS证书**
   - 注册Apple开发者账号
   - 创建App ID和证书
   - 配置到 `manifest.json` 的 `app-plus` 部分

2. **编译IPA**
   - 在HBuilderX中选择"发行" → "原生App-云打包"
   - 选择iOS平台
   - 等待打包完成

3. **发布到App Store**
   - 使用Application Loader上传IPA
   - 在App Store Connect填写应用信息
   - 提交审核

### 4. 服务器配置

#### 4.1 API服务配置
- 确保AI服务API地址可访问
- 配置跨域请求CORS
- 设置API请求限制和监控

#### 4.2 安全配置
- 启用HTTPS
- 配置API密钥安全存储
- 设置用户数据加密
- 实施访问控制

### 5. 测试和验证

#### 5.1 功能测试
- AI问诊功能测试
- 图像诊断功能测试
- 用户登录和注册测试
- 数据存储和同步测试

#### 5.2 兼容性测试
- 不同设备型号测试
- 不同操作系统版本测试
- 不同浏览器测试（H5）

#### 5.3 性能测试
- 应用启动速度测试
- API响应时间测试
- 内存和CPU使用率测试

## 常见问题解决

### 1. 编译错误
- 检查HBuilderX版本是否兼容
- 确认依赖是否正确安装
- 查看编译日志中的错误信息

### 2. 运行时错误
- 检查网络连接状态
- 验证API配置是否正确
- 查看控制台错误信息

### 3. 平台特定问题
- 微信小程序：检查域名配置和权限设置
- Android：检查权限申请和证书配置
- iOS：检查证书配置和隐私政策

## 监控和维护

### 1. 应用监控
- 集成应用性能监控工具
- 设置错误报警机制
- 监控用户行为和使用情况

### 2. 更新维护
- 定期更新依赖库
- 修复已知问题
- 添加新功能

### 3. 数据备份
- 定期备份用户数据
- 建立灾难恢复机制
- 确保数据安全

## 部署清单

- [ ] 环境准备完成
- [ ] 配置文件设置完成
- [ ] 微信小程序部署完成
- [ ] H5网页部署完成
- [ ] Android应用部署完成
- [ ] iOS应用部署完成
- [ ] 服务器配置完成
- [ ] 测试验证通过
- [ ] 监控系统部署完成

## 技术支持

如有部署问题，请联系技术支持团队或查阅以下资源：
- UniApp官方文档
- HBuilderX用户手册
- 各平台开发者文档