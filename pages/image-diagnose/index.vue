<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="status-bar"></view>
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="iconfont icon-back">←</text>
        </view>
        <text class="header-title">骨关节炎MRI诊断</text>
        <view class="placeholder"></view>
      </view>
    </view>
    
    <!-- 诊断类型选择 -->
    <view class="diagnosis-types">
      <view 
        class="type-item" 
        :class="{ active: currentType === index }"
        v-for="(item, index) in diagnosisTypes" 
        :key="index"
        @click="selectType(index)"
      >
        <text>{{ item.name }}</text>
      </view>
    </view>
    
    <!-- 图像上传区域 -->
    <view class="upload-area" v-if="!imageUrl && !diagnosisResult">
      <view class="upload-hint">
        <view class="upload-icon">
          <text class="iconfont icon-image"></text>
        </view>
        <text class="hint-text">上传膝关节MRI图像</text>
        <text class="sub-hint">请上传清晰的膝关节核磁共振图像，以便系统准确判断骨关节炎分期</text>
      </view>
      <view class="upload-buttons">
        <view class="btn select-image" @click="selectImage">
          <text class="btn-icon iconfont icon-album"></text>
          <text class="btn-text">选择MRI图像</text>
        </view>
      </view>
    </view>
    
    <!-- 图像预览区域 -->
    <view class="preview-area" v-if="imageUrl && !diagnosisResult">
      <image class="preview-image" :src="imageUrl" mode="aspectFill"></image>
      <view class="preview-actions">
        <view class="action-btn cancel" @click="cancelImage">重新选择</view>
        <view class="action-btn confirm" @click="startDiagnosis">开始诊断</view>
      </view>
    </view>
    
    <!-- 诊断结果区域 -->
    <view class="result-area" v-if="diagnosisResult">
      <view class="result-header">
        <view class="result-title">诊断结果</view>
        <view class="result-time">{{ currentTime }}</view>
      </view>
      
      <view class="result-content">
        <view class="result-image-area">
          <image class="result-image" :src="imageUrl" mode="aspectFill"></image>
        </view>
        
        <view class="result-detail">
          <view class="result-item" v-for="(item, index) in diagnosisResult.items" :key="index">
            <view class="item-name">{{ item.name }}</view>
            <view class="item-value">{{ item.value }}</view>
          </view>
          
          <view class="result-analysis">
            <view class="analysis-title">分析说明</view>
            <view class="analysis-text">{{ diagnosisResult.analysis }}</view>
          </view>
          
          <view class="result-suggestion">
            <view class="suggestion-title">建议</view>
            <view class="suggestion-text">{{ diagnosisResult.suggestion }}</view>
          </view>
        </view>
      </view>
      
      <view class="result-actions">
        <view class="action-btn again" @click="resetDiagnosis">再次诊断</view>
        <view class="action-btn save" @click="saveDiagnosis">保存结果</view>
      </view>
    </view>
    
    <!-- 诊断历史记录 -->
    <view class="history-section" v-if="!imageUrl && !diagnosisResult && diagnosisHistory.length > 0">
      <view class="section-title">
        <text class="title">诊断历史</text>
        <text class="more" @click="viewAllHistory">查看全部</text>
      </view>
      
      <view class="history-list">
        <view class="history-item" v-for="(item, index) in diagnosisHistory" :key="index" @click="viewHistoryDetail(item)">
          <view class="history-type">{{ item.type }}</view>
          <image class="history-image" :src="item.imageUrl" mode="aspectFill"></image>
          <view class="history-info">
            <view class="info-main">{{ item.mainResult }}</view>
            <view class="info-time">{{ item.time }}</view>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入图像分析服务
import imageAnalysis from '@/utils/image-analysis.js';

export default {
  data() {
    return {
      diagnosisTypes: [
        { name: '骨关节炎MRI', hint: '上传膝关节核磁共振(MRI)图像进行骨关节炎分期诊断' }
      ],
      currentType: 0,
      imageUrl: '',
      diagnosisResult: null,
      currentTime: '',
      diagnosisHistory: [
        { 
          id: 1,
          type: '骨关节炎MRI', 
          imageUrl: '/static/sample-knee-mri.jpg', 
          mainResult: '骨关节炎II期', 
          time: '2023-10-15 14:30'
        }
      ],
      statusBarHeight: 20 // 默认值
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    selectType(index) {
      this.currentType = index;
    },
    takePhoto() {
      // 调用相机API
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
        }
      });
    },
    selectImage() {
      // 从相册选择图片
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
        }
      });
    },
    cancelImage() {
      this.imageUrl = '';
    },
    async startDiagnosis() {
      // 显示加载状态
      uni.showLoading({
        title: '正在诊断中...'
      });

      try {
        // 将图像转换为Base64格式
        const base64Image = await this.imageToBase64(this.imageUrl);
        
        // 调用API进行图像分析
        const result = await imageAnalysis.analyzeImage(base64Image);
        
        // 设置诊断结果
        this.diagnosisResult = result;
        
        // 设置当前时间
        const now = new Date();
        this.currentTime = `${now.getFullYear()}-${this.padZero(now.getMonth() + 1)}-${this.padZero(now.getDate())} ${this.padZero(now.getHours())}:${this.padZero(now.getMinutes())}`;
        
      } catch (error) {
        console.error('诊断失败:', error);
        uni.hideLoading();
        uni.showToast({
          title: '诊断失败，请重试',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    },

    /**
     * 将图像文件转换为Base64编码
     * @param {string} filePath - 图像文件路径
     * @returns {Promise<string>} Base64编码的图像数据
     */
    async imageToBase64(filePath) {
      try {
        // 使用UniApp的文件系统API读取本地文件
        const fileManager = uni.getFileSystemManager();
        
        // 读取文件为Base64
        const base64Data = await new Promise((resolve, reject) => {
          fileManager.readFile({
            filePath: filePath,
            encoding: 'base64',
            success: (res) => {
              resolve(res.data);
            },
            fail: (error) => {
              reject(error);
            }
          });
        });
        
        // 添加图像前缀
        const extension = this.getImageExtension(filePath);
        return `data:image/${extension};base64,${base64Data}`;
        
      } catch (error) {
        console.error('图像转换失败:', error);
        throw new Error('图像转换失败: ' + error.message);
      }
    },

    /**
     * 从文件路径获取图像扩展名
     * @param {string} filePath - 文件路径
     * @returns {string} 图像扩展名
     */
    getImageExtension(filePath) {
      const extension = filePath.split('.').pop().toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      return imageExtensions.includes(extension) ? extension : 'jpg';
    },
    generateMockResult(stage) {
      // 不同分期的骨关节炎诊断结果
      const stageResults = {
        'I': {
          items: [
            { name: '诊断结果', value: '膝关节骨关节炎 (97% 可信度)' },
            { name: '分期', value: 'I期 (早期)' },
            { name: '部位', value: '膝关节内侧间隙' }
          ],
          analysis: '核磁共振图像显示膝关节软骨有轻微变化，软骨表面完整但有轻度信号异常。关节间隙基本正常，无明显骨髓水肿信号。半月板结构完整，韧带无异常。根据国际软骨修复学会(ICRS)分级标准，评估为I期(早期)骨关节炎。',
          suggestion: '建议适当控制体重，进行低强度有氧运动如游泳、骑自行车等。避免剧烈运动和长时间站立。可考虑口服软骨保护剂如氨糖和硫酸软骨素。定期随访，监测病情变化。'
        },
        'II': {
          items: [
            { name: '诊断结果', value: '膝关节骨关节炎 (98% 可信度)' },
            { name: '分期', value: 'II期 (轻度)' },
            { name: '部位', value: '膝关节内侧间隙' }
          ],
          analysis: '核磁共振图像显示膝关节软骨有中度磨损，关节间隙轻度变窄。可见少量骨髓水肿信号，关节边缘有早期骨赘形成。半月板信号增强但结构完整。根据国际软骨修复学会(ICRS)分级标准，评估为II期(轻度)骨关节炎。',
          suggestion: '建议进行适当的关节保护，减轻体重负担，避免过度使用关节。可考虑物理治疗、非甾体抗炎药物和关节腔内注射透明质酸钠等治疗。建议定期随访，监测病情进展。'
        },
        'III': {
          items: [
            { name: '诊断结果', value: '膝关节骨关节炎 (99% 可信度)' },
            { name: '分期', value: 'III期 (中度)' },
            { name: '部位', value: '膝关节内侧和外侧间隙' }
          ],
          analysis: '核磁共振图像显示膝关节软骨明显磨损，软骨下骨质暴露面积超过50%。关节间隙明显变窄，可见多处骨髓水肿信号。关节边缘有明显骨赘形成，半月板退变明显。根据国际软骨修复学会(ICRS)分级标准，评估为III期(中度)骨关节炎。',
          suggestion: '建议积极控制体重，使用拐杖等辅助工具减轻关节负担。可考虑关节腔内注射玻璃酸钠或糖皮质激素治疗。如保守治疗效果不佳，可考虑关节镜下清理或微骨折术等微创手术治疗。建议每3-6个月随访一次。'
        },
        'IV': {
          items: [
            { name: '诊断结果', value: '膝关节骨关节炎 (99% 可信度)' },
            { name: '分期', value: 'IV期 (重度)' },
            { name: '部位', value: '膝关节全面受累' }
          ],
          analysis: '核磁共振图像显示膝关节软骨几乎完全磨损，软骨下骨质广泛暴露。关节间隙严重变窄，可见大面积骨髓水肿信号和囊性变。关节边缘有大量骨赘形成，半月板严重退变。根据国际软骨修复学会(ICRS)分级标准，评估为IV期(重度)骨关节炎。',
          suggestion: '建议考虑手术治疗，如人工膝关节置换术。术前可使用止痛药物和辅助工具减轻症状。术后需进行规范的康复训练。如不适合手术，可考虑支具固定、强化肌力训练和综合性疼痛管理。建议每3个月随访一次。'
        }
      };
      
      this.diagnosisResult = stageResults[stage];
    },
    resetDiagnosis() {
      this.imageUrl = '';
      this.diagnosisResult = null;
    },
    saveDiagnosis() {
      // 保存诊断结果到历史记录
      if (!this.diagnosisResult || !this.diagnosisResult.items) {
        uni.showToast({
          title: '没有可保存的诊断结果',
          icon: 'error'
        });
        return;
      }

      uni.showToast({
        title: '已保存到诊断历史',
        icon: 'success'
      });
      
      // 添加到历史记录
      this.diagnosisHistory.unshift({
        id: Date.now(),
        type: this.diagnosisTypes[this.currentType].name,
        imageUrl: this.imageUrl,
        mainResult: this.diagnosisResult.items[0].value,
        time: this.currentTime,
        confidence: this.diagnosisResult.confidence,
        stage: this.diagnosisResult.stage
      });
      
      // 延迟重置诊断状态
      setTimeout(() => {
        this.resetDiagnosis();
      }, 1500);
    },
    viewAllHistory() {
      uni.navigateTo({
        url: '/pages/image-diagnose/history'
      });
    },
    viewHistoryDetail(item) {
      uni.navigateTo({
        url: `/pages/image-diagnose/detail?id=${item.id}`
      });
    },
    padZero(num) {
      return num < 10 ? `0${num}` : num;
    },
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          // 如果没有上一页，则跳转到首页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }
  }
}
</script>

<style>
.container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 30rpx;
}

/* 顶部标题 */
.header {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  flex-shrink: 0;
  position: relative;
}

.status-bar {
  height: 44rpx;
  width: 100%;
}

.nav-bar {
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  position: relative;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn text {
  color: #fff;
  font-size: 36rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #fff;
  flex: 1;
  text-align: center;
}

.placeholder {
  width: 60rpx;
}

/* 诊断类型选择 */
.diagnosis-types {
  display: flex;
  background-color: #fff;
  padding: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  white-space: nowrap;
}

.type-item {
  display: inline-block;
  padding: 16rpx 30rpx;
  margin: 0 10rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.type-item.active {
  background-color: rgba(58, 123, 213, 0.1);
  color: #3a7bd5;
  font-weight: 500;
}

/* 图像上传区域 */
.upload-area {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.upload-icon {
  font-size: 80rpx;
  color: #3a7bd5;
  margin-bottom: 20rpx;
}

.hint-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.sub-hint {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  max-width: 80%;
}

.upload-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 40rpx;
  margin: 0 20rpx;
  border-radius: 8rpx;
  background-color: #f0f3f8;
}

.take-photo {
  color: #3a7bd5;
}

.select-image {
  color: #00d2ff;
}

.btn-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.btn-text {
  font-size: 24rpx;
}

/* 图像预览区域 */
.preview-area {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.preview-image {
  width: 100%;
  height: 400rpx;
  border-radius: 8rpx;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
}

.cancel {
  background-color: #f0f3f8;
  color: #666;
}

.confirm {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
}

/* 诊断结果区域 */
.result-area {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.result-time {
  font-size: 24rpx;
  color: #999;
}

.result-content {
  padding: 20rpx 0;
}

.result-image-area {
  margin-bottom: 30rpx;
}

.result-image {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
}

.result-detail {
  padding: 0 10rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.item-name {
  font-size: 28rpx;
  color: #666;
}

.item-value {
  font-size: 28rpx;
  color: #3a7bd5;
  font-weight: 500;
}

.result-analysis, .result-suggestion {
  margin-top: 20rpx;
}

.analysis-title, .suggestion-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.analysis-text, .suggestion-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.result-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.again {
  background-color: #f0f3f8;
  color: #666;
}

.save {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
}

/* 诊断历史记录 */
.history-section {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.section-title .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-title .more {
  font-size: 24rpx;
  color: #999;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 20rpx 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-type {
  padding: 6rpx 16rpx;
  background-color: rgba(58, 123, 213, 0.1);
  color: #3a7bd5;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-right: 20rpx;
}

.history-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.history-info {
  flex: 1;
}

.info-main {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.info-time {
  font-size: 22rpx;
  color: #999;
}

.icon-right {
  color: #ccc;
  font-size: 32rpx;
}
</style> 