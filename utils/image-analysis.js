/**
 * 图像分析服务模块
 * 用于调用外部图像分类API并处理响应结果
 * 支持膝关节MRI图像的骨关节炎分期诊断
 */

// 使用UniApp的uni.request进行HTTP请求

// API配置信息
const API_CONFIG = {
  url: 'https://e0e1g5s8r2y0v675.aistudio-hub.baidu.com/image-classification',
  token: 'token 0552473792dbe002d3f69bb34aa207968ebf6ecc',
  timeout: 30000
};

// API类别ID到前端分期的映射关系
// 将API返回的5个类别映射到前端的4个分期阶段
const STAGE_MAPPING = {
  0: { stage: 'I', name: '前期', label: 'I期 (早期)' },
  1: { stage: 'I', name: '早期', label: 'I期 (早期)' },
  2: { stage: 'II', name: '轻度', label: 'II期 (轻度)' },
  3: { stage: 'III', name: '中度', label: 'III期 (中度)' },
  4: { stage: 'IV', name: '重度', label: 'IV期 (重度)' }
};

// 各分期的医学分析模板和建议
// 基于国际软骨修复学会(ICRS)分级标准
const ANALYSIS_TEMPLATES = {
  'I': {
    analysis: '核磁共振图像显示膝关节软骨有轻微变化，软骨表面完整但有轻度信号异常。关节间隙基本正常，无明显骨髓水肿信号。半月板结构完整，韧带无异常。根据国际软骨修复学会(ICRS)分级标准，评估为I期(早期)骨关节炎。',
    suggestion: '建议适当控制体重，进行低强度有氧运动如游泳、骑自行车等。避免剧烈运动和长时间站立。可考虑口服软骨保护剂如氨糖和硫酸软骨素。定期随访，监测病情变化。'
  },
  'II': {
    analysis: '核磁共振图像显示膝关节软骨有中度磨损，关节间隙轻度变窄。可见少量骨髓水肿信号，关节边缘有早期骨赘形成。半月板信号增强但结构完整。根据国际软骨修复学会(ICRS)分级标准，评估为II期(轻度)骨关节炎。',
    suggestion: '建议进行适当的关节保护，减轻体重负担，避免过度使用关节。可考虑物理治疗、非甾体抗炎药物和关节腔内注射透明质酸钠等治疗。建议定期随访，监测病情进展。'
  },
  'III': {
    analysis: '核磁共振图像显示膝关节软骨明显磨损，软骨下骨质暴露面积超过50%。关节间隙明显变窄，可见多处骨髓水肿信号。关节边缘有明显骨赘形成，半月板退变明显。根据国际软骨修复学会(ICRS)分级标准，评估为III期(中度)骨关节炎。',
    suggestion: '建议积极控制体重，使用拐杖等辅助工具减轻关节负担。可考虑关节腔内注射玻璃酸钠或糖皮质激素治疗。如保守治疗效果不佳，可考虑关节镜下清理或微骨折术等微创手术治疗。建议每3-6个月随访一次。'
  },
  'IV': {
    analysis: '核磁共振图像显示膝关节软骨几乎完全磨损，软骨下骨质广泛暴露。关节间隙严重变窄，可见大面积骨髓水肿信号和囊性变。关节边缘有大量骨赘形成，半月板严重退变。根据国际软骨修复学会(ICRS)分级标准，评估为IV期(重度)骨关节炎。',
    suggestion: '建议考虑手术治疗，如人工膝关节置换术。术前可使用止痛药物和辅助工具减轻症状。术后需进行规范的康复训练。如不适合手术，可考虑支具固定、强化肌力训练和综合性疼痛管理。建议每3个月随访一次。'
  }
};

const imageAnalysisService = {
  /**
   * 分析图像并返回诊断结果
   * @param {string} imageData - 图像的Base64编码数据
   * @returns {Promise<Object>} 诊断结果对象
   * @throws {Error} 当API调用失败时抛出错误
   */
  async analyzeImage(imageData) {
    try {
      // 清理Base64数据（移除前缀）
      const cleanImageData = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      
      // 准备请求数据
      const data = JSON.stringify({
        image: cleanImageData
      });

      // 配置请求
      const config = {
        method: 'post',
        url: API_CONFIG.url,
        headers: { 
          'Authorization': API_CONFIG.token, 
          'Content-Type': 'application/json'
        },
        data: data
      };

      // 调用外部API进行图像分析
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url: API_CONFIG.url,
          method: 'POST',
          header: {
            'Authorization': API_CONFIG.token,
            'Content-Type': 'application/json'
          },
          data: JSON.parse(data),
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(new Error(`网络请求失败: ${err.errMsg}`));
          }
        });
      });

      // 验证API响应
      if (response.statusCode === 200 && response.data.result) {
        return this.processApiResponse(response.data);
      } else {
        throw new Error(`API响应异常: ${response.statusCode} ${response.data.errorMsg || '未知错误'}`);
      }
    } catch (error) {
      console.error('图像分析失败:', error);
      throw new Error(`图像分析失败: ${error.message || '网络错误'}`);
    }
  },

  /**
   * 处理API响应数据，转换为前端格式
   * @param {Object} apiResponse - API原始响应数据
   * @returns {Object} 处理后的诊断结果
   */
  processApiResponse(apiResponse) {
    if (!apiResponse.result || !apiResponse.result.categories) {
      throw new Error('API响应数据格式不正确');
    }

    const categories = apiResponse.result.categories;
    
    // 找到置信度最高的类别作为主要诊断结果
    const primaryCategory = categories.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    // 验证类别ID是否在映射范围内
    if (!STAGE_MAPPING[primaryCategory.id]) {
      throw new Error(`未知的类别ID: ${primaryCategory.id}`);
    }

    const stageInfo = STAGE_MAPPING[primaryCategory.id];
    const template = ANALYSIS_TEMPLATES[stageInfo.stage];

    // 构建返回结果
    return {
      items: [
        { 
          name: '诊断结果', 
          value: `膝关节骨关节炎 (${Math.round(primaryCategory.score * 100)}% 可信度)` 
        },
        { name: '分期', value: stageInfo.label },
        { name: '部位', value: '膝关节内侧间隙' }
      ],
      analysis: template.analysis,
      suggestion: template.suggestion,
      confidence: primaryCategory.score,
      stage: stageInfo.stage,
      allCategories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        score: cat.score,
        stage: STAGE_MAPPING[cat.id]?.stage || 'Unknown'
      }))
    };
  },

  /**
   * 验证图像数据格式
   * @param {string} imageData - 图像数据
   * @returns {boolean} 是否为有效的Base64图像数据
   */
  validateImageData(imageData) {
    if (!imageData || typeof imageData !== 'string') {
      return false;
    }
    
    // 检查是否为有效的Base64格式
    const base64Regex = /^data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=]+)$/;
    const simpleBase64Regex = /^([A-Za-z0-9+/=]+)$/;
    
    return base64Regex.test(imageData) || simpleBase64Regex.test(imageData);
  },

  /**
   * 获取API状态信息
   * @returns {Promise<Object>} API状态信息
   */
  async getApiStatus() {
    try {
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url: API_CONFIG.url,
          method: 'HEAD',
          header: {
            'Authorization': API_CONFIG.token
          },
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(new Error(`网络请求失败: ${err.errMsg}`));
          }
        });
      });

      return {
        status: response.statusCode === 200 ? 'online' : 'offline',
        statusCode: response.statusCode,
        responseTime: Date.now()
      };
    } catch (error) {
      return {
        status: 'offline',
        error: error.message
      };
    }
  }
};

module.exports = imageAnalysisService;