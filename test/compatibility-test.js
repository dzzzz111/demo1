/**
 * 兼容性修复测试脚本
 * 用于验证axios替代uni.getFileSystemManager()的功能
 */

// 模拟浏览器环境中的btoa函数
if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

// 模拟axios
const axios = require('axios');

/**
 * 测试图像转换功能
 */
async function testImageConversion() {
  console.log('开始测试图像转换功能...');
  
  try {
    // 模拟图像URL（使用公开的测试图像）
    const testImageUrl = 'https://via.placeholder.com/150x150.jpg?text=Test+Image';
    
    console.log('1. 测试图像数据获取...');
    const response = await axios.get(testImageUrl, {
      responseType: 'arraybuffer'
    });
    
    console.log('图像数据大小:', response.data.byteLength, 'bytes');
    
    console.log('2. 测试Base64转换...');
    const base64 = btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    console.log('Base64数据长度:', base64.length);
    
    console.log('3. 测试图像格式前缀...');
    const extension = 'jpg';
    const fullBase64 = `data:image/${extension};base64,${base64}`;
    
    console.log('完整Base64前缀:', fullBase64.substring(0, 50) + '...');
    
    console.log('✅ 图像转换功能测试通过');
    
    return {
      success: true,
      base64Data: fullBase64,
      dataSize: response.data.byteLength
    };
    
  } catch (error) {
    console.error('❌ 图像转换功能测试失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 测试图像扩展名获取
 */
function testImageExtension() {
  console.log('开始测试图像扩展名获取...');
  
  const testCases = [
    { path: 'image.jpg', expected: 'jpg' },
    { path: 'photo.jpeg', expected: 'jpeg' },
    { path: 'picture.PNG', expected: 'png' },
    { path: 'animation.gif', expected: 'gif' },
    { path: 'unknown.xyz', expected: 'jpg' }, // 默认值
    { path: 'noextension', expected: 'jpg' } // 默认值
  ];
  
  function getImageExtension(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(extension) ? extension : 'jpg';
  }
  
  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    const result = getImageExtension(testCase.path);
    const passed = result === testCase.expected;
    
    console.log(`测试 ${index + 1}: ${testCase.path} -> ${result} ${passed ? '✅' : '❌'}`);
    
    if (!passed) {
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log('✅ 图像扩展名获取测试通过');
  } else {
    console.log('❌ 图像扩展名获取测试失败');
  }
  
  return allPassed;
}

/**
 * 测试Base64数据清理
 */
function testBase64Cleanup() {
  console.log('开始测试Base64数据清理...');
  
  const testCases = [
    {
      input: 'data:image/jpeg;base64,abc123',
      expected: 'abc123',
      description: '标准JPEG格式'
    },
    {
      input: 'data:image/png;base64,xyz789',
      expected: 'xyz789',
      description: '标准PNG格式'
    },
    {
      input: 'abc123',
      expected: 'abc123',
      description: '无前缀格式'
    },
    {
      input: '',
      expected: '',
      description: '空字符串'
    }
  ];
  
  function cleanBase64Data(imageData) {
    return imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  }
  
  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    const result = cleanBase64Data(testCase.input);
    const passed = result === testCase.expected;
    
    console.log(`测试 ${index + 1} (${testCase.description}): ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  输入: ${testCase.input}`);
      console.log(`  期望: ${testCase.expected}`);
      console.log(`  实际: ${result}`);
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log('✅ Base64数据清理测试通过');
  } else {
    console.log('❌ Base64数据清理测试失败');
  }
  
  return allPassed;
}

/**
 * 测试API集成（模拟）
 */
async function testApiIntegration() {
  console.log('开始测试API集成...');
  
  try {
    // 模拟API响应
    const mockApiResponse = {
      logId: 'test-log-id-123',
      result: {
        categories: [
          { id: 3, name: '中度', score: 0.347 },
          { id: 2, name: '轻度', score: 0.219 },
          { id: 0, name: '前期', score: 0.210 },
          { id: 4, name: '重度', score: 0.128 },
          { id: 1, name: '早期', score: 0.093 }
        ]
      }
    };
    
    // 模拟processApiResponse函数
    function processApiResponse(apiResponse) {
      if (!apiResponse.result || !apiResponse.result.categories) {
        throw new Error('API响应数据格式不正确');
      }

      const categories = apiResponse.result.categories;
      
      const primaryCategory = categories.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );

      const STAGE_MAPPING = {
        0: { stage: 'I', name: '前期', label: 'I期 (早期)' },
        1: { stage: 'I', name: '早期', label: 'I期 (早期)' },
        2: { stage: 'II', name: '轻度', label: 'II期 (轻度)' },
        3: { stage: 'III', name: '中度', label: 'III期 (中度)' },
        4: { stage: 'IV', name: '重度', label: 'IV期 (重度)' }
      };

      const ANALYSIS_TEMPLATES = {
        'I': {
          analysis: 'I期分析文本',
          suggestion: 'I期建议'
        },
        'II': {
          analysis: 'II期分析文本',
          suggestion: 'II期建议'
        },
        'III': {
          analysis: 'III期分析文本',
          suggestion: 'III期建议'
        },
        'IV': {
          analysis: 'IV期分析文本',
          suggestion: 'IV期建议'
        }
      };

      const stageInfo = STAGE_MAPPING[primaryCategory.id];
      const template = ANALYSIS_TEMPLATES[stageInfo.stage];

      return {
        items: [
          { name: '诊断结果', value: `膝关节骨关节炎 (${Math.round(primaryCategory.score * 100)}% 可信度)` },
          { name: '分期', value: stageInfo.label },
          { name: '部位', value: '膝关节内侧间隙' }
        ],
        analysis: template.analysis,
        suggestion: template.suggestion,
        confidence: primaryCategory.score,
        stage: stageInfo.stage,
        allCategories: categories
      };
    }
    
    const result = processApiResponse(mockApiResponse);
    
    console.log('API响应处理结果:');
    console.log('- 主要分期:', result.stage);
    console.log('- 置信度:', result.confidence);
    console.log('- 诊断项数量:', result.items.length);
    
    // 验证结果结构
    const expectedKeys = ['items', 'analysis', 'suggestion', 'confidence', 'stage', 'allCategories'];
    const hasAllKeys = expectedKeys.every(key => key in result);
    
    if (hasAllKeys) {
      console.log('✅ API集成测试通过');
      return true;
    } else {
      console.log('❌ API集成测试失败 - 缺少必要字段');
      return false;
    }
    
  } catch (error) {
    console.error('❌ API集成测试失败:', error.message);
    return false;
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('================================');
  console.log('开始运行兼容性修复测试');
  console.log('================================');
  
  const results = {
    imageConversion: await testImageConversion(),
    imageExtension: testImageExtension(),
    base64Cleanup: testBase64Cleanup(),
    apiIntegration: await testApiIntegration()
  };
  
  console.log('');
  console.log('================================');
  console.log('测试结果汇总');
  console.log('================================');
  
  Object.entries(results).forEach(([testName, result]) => {
    const success = typeof result === 'object' ? result.success : result;
    console.log(`${testName}: ${success ? '✅ 通过' : '❌ 失败'}`);
    if (typeof result === 'object' && result.error) {
      console.log(`  错误: ${result.error}`);
    }
  });
  
  const allPassed = Object.values(results).every(result => 
    typeof result === 'object' ? result.success : result
  );
  
  console.log('');
  console.log('================================');
  console.log(`总体结果: ${allPassed ? '✅ 所有测试通过' : '❌ 部分测试失败'}`);
  console.log('================================');
  
  return allPassed;
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

// 导出测试函数供其他模块使用
module.exports = {
  testImageConversion,
  testImageExtension,
  testBase64Cleanup,
  testApiIntegration,
  runAllTests
};