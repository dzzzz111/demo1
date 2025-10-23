# 图片优化指南

## 问题描述
当前主包中包含大量未优化的图片文件，导致主包大小超过微信小程序1.5M限制。

## 大文件列表
- `static/icons/ai-icon.png` - 752KB
- `static/icons/image-icon.png` - 770KB  
- `static/images/news1.png` - 938KB
- `static/images/news2.png` - 480KB
- `static/images/news3.png` - 755KB
- `static/images/ai-avatar.png` - 747KB
- `static/images/user-avatar.png` - 324KB
- `static/images/default-avatar.png` - 261KB

**总计**: 约5MB

## 解决方案

### 方案1: 压缩图片（推荐）

使用在线工具压缩现有图片：

**在线压缩工具:**
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- Compressor.io: https://compressor.io/

**压缩步骤:**
1. 访问 https://tinypng.com/
2. 将图片拖放到网页中
3. 等待压缩完成
4. 下载压缩后的图片
5. 替换原图片文件

**目标:**
- 图标文件 < 100KB
- 新闻图片 < 200KB
- 头像图片 < 100KB

### 方案2: 使用网络图片

将大图片上传到CDN或云存储，使用网络地址：

```javascript
// 示例：
// 本地图片: /static/images/news1.png
// 改为网络图片: https://cdn.example.com/news1.png
```

**优点:**
- 不占用小程序包大小
- 可以使用高质量图片

**缺点:**
- 需要网络请求
- 首次加载较慢

### 方案3: 使用WebP格式

WebP格式图片体积比PNG小30-80%：

**转换工具:**
- Squoosh: https://squoosh.app/
- CloudConvert: https://cloudconvert.com/

**注意:** 微信小程序支持WebP格式

### 方案4: 按需加载

对于非首屏图片，使用懒加载：

```vue
<image 
  :src="imageUrl" 
  lazy-load
  mode="aspectFill"
></image>
```

## 已实施的优化

### 1. 启用代码压缩
已在 `manifest.json` 中配置：
```json
{
  "mp-weixin": {
    "setting": {
      "es6": true,           // ES6转ES5
      "minified": true,      // 代码压缩
      "postcss": true        // CSS后处理
    }
  }
}
```

### 2. 配置分包
主包只保留核心页面：
- 首页 (pages/index/index)
- 个人中心 (pages/mine/index)
- 健康社区 (pages/community/index)

分包A (pagesA):
- AI问诊 (pagesA/ai-doctor/index)
- 图像诊断 (pagesA/image-diagnose/index)

分包B (pagesB):
- 登录页 (pagesB/mine/login)
- 注册页 (pagesB/mine/register)
- 设置页 (pagesB/mine/settings)
- 社区详情 (pagesB/community/detail)

### 3. 删除无用文件
已删除：`static/images/屏幕截图 2025-07-03 002527.png` (620KB)

## 测试步骤

### 1. 重新编译
在HBuilderX中：
- 运行 → 运行到小程序模拟器 → 微信开发者工具

### 2. 检查包大小
在微信开发者工具中：
- 点击右上角"详情"
- 查看"代码质量"标签
- 确认主包 < 1.5M

### 3. 预期结果
✅ ES6代码已转换
✅ JS/CSS已压缩
✅ 主包大小减少
✅ 分包自动按需加载

## 进一步优化建议

### 1. 图标优化
将功能图标改为iconfont或SVG：
```html
<!-- 使用字体图标替代图片 -->
<text class="iconfont icon-ai"></text>
```

### 2. 图片格式优化
| 类型 | 当前格式 | 建议格式 | 预期大小 |
|------|---------|---------|---------|
| 图标 | PNG     | WebP/SVG | < 50KB  |
| 新闻图 | PNG     | WebP    | < 150KB |
| 头像 | PNG     | WebP    | < 80KB  |

### 3. 使用CDN
对于新闻图片等静态资源，建议上传到CDN。

## 常见问题

### Q1: 分包后页面跳转失败？
A: 检查跳转路径是否正确：
- 主包页面: `/pages/xxx/xxx`
- 分包页面: `/pagesA/xxx/xxx` 或 `/pagesB/xxx/xxx`

### Q2: 压缩后图片模糊？
A: 适当降低压缩率，保持清晰度和文件大小平衡。

### Q3: 如何查看每个文件大小？
A: 在微信开发者工具 → 详情 → 代码依赖分析

## 检查清单

优化完成后检查：
- [ ] 主包大小 < 1.5M
- [ ] JS文件已压缩
- [ ] WXML文件已压缩
- [ ] WXSS文件已压缩
- [ ] 所有页面可正常跳转
- [ ] 图片正常显示
- [ ] 功能正常运行

---

**更新时间**: 2025-10-22
**当前状态**: 已配置分包和代码压缩，待压缩图片
