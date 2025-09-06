/**
 * 本地兼容性修复测试脚本
 * 不依赖网络连接的本地测试版本
 */

// 模拟浏览器环境中的btoa函数
if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
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
    { path: 'drawing.bmp', expected: 'bmp' },
    { path: 'photo.webp', expected: 'webp' },
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
      input: 'data:image/gif;base64,test456',
      expected: 'test456',
      description: '标准GIF格式'
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
    },
    {
      input: 'data:image/webp;base64,webptest',
      expected: 'webptest',
      description: 'WebP格式'
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
      console.log(`  输入: "${testCase.input}"`);
      console.log(`  期望: "${testCase.expected}"`);
      console.log(`  实际: "${result}"`);
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
 * 测试ArrayBuffer到Base64转换
 */
function testArrayBufferToBase64() {
  console.log('开始测试ArrayBuffer到Base64转换...');
  
  // 创建测试数据
  const testData = 'Hello, World!';
  const buffer = Buffer.from(testData, 'utf8');
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  
  try {
    // 模拟转换过程
    const uint8Array = new Uint8Array(arrayBuffer);
    const binaryString = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
    const base64 = btoa(binaryString);
    
    console.log('原始数据:', testData);
    console.log('Base64结果:', base64);
    
    // 验证转换结果
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const passed = decoded === testData;
    
    console.log(`转换验证: ${passed ? '✅' : '❌'}`);
    
    if (passed) {
      console.log('✅ ArrayBuffer到Base64转换测试通过');
    } else {
      console.log('❌ ArrayBuffer到Base64转换测试失败');
    }
    
    return passed;
    
  } catch (error) {
    console.error('❌ ArrayBuffer到Base64转换测试失败:', error.message);
    return false;
  }
}

/**
 * 测试API集成（模拟）
 */
function testApiIntegration() {
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
        allCategories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          score: cat.score,
          stage: STAGE_MAPPING[cat.id]?.stage || 'Unknown'
        }))
      };
    }
    
    const result = processApiResponse(mockApiResponse);
    
    console.log('API响应处理结果:');
    console.log('- 主要分期:', result.stage);
    console.log('- 置信度:', result.confidence);
    console.log('- 诊断项数量:', result.items.length);
    console.log('- 分析文本长度:', result.analysis.length);
    console.log('- 建议文本长度:', result.suggestion.length);
    console.log('- 所有分类数量:', result.allCategories.length);
    
    // 验证结果结构
    const expectedKeys = ['items', 'analysis', 'suggestion', 'confidence', 'stage', 'allCategories'];
    const hasAllKeys = expectedKeys.every(key => key in result);
    
    // 验证数据类型
    const typeChecks = {
      'items': Array.isArray(result.items),
      'analysis': typeof result.analysis === 'string',
      'suggestion': typeof result.suggestion === 'string',
      'confidence': typeof result.confidence === 'number',
      'stage': typeof result.stage === 'string',
      'allCategories': Array.isArray(result.allCategories)
    };
    
    console.log('数据类型验证:', typeChecks);
    
    if (hasAllKeys && Object.values(typeChecks).every(check => check)) {
      console.log('✅ API集成测试通过');
      return true;
    } else {
      console.log('❌ API集成测试失败');
      if (!hasAllKeys) {
        console.log('  缺少必要字段');
      }
      if (!Object.values(typeChecks).every(check => check)) {
        console.log('  数据类型错误');
      }
      return false;
    }
    
  } catch (error) {
    console.error('❌ API集成测试失败:', error.message);
    return false;
  }
}

/**
 * 测试错误处理
 */
function testErrorHandling() {
  console.log('开始测试错误处理...');
  
  let allPassed = true;
  
  // 测试空数据
  try {
    function validateImageData(imageData) {
      if (!imageData || typeof imageData !== 'string') {
        return false;
      }
      
      const base64Regex = /^data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=]+)$/;
      const simpleBase64Regex = /^([A-Za-z0-9+/=]+)$/;
      
      return base64Regex.test(imageData) || simpleBase64Regex.test(imageData);
    }
    
    const testCases = [
      { input: null, expected: false },
      { input: undefined, expected: false },
      { input: '', expected: false },
      { input: 'data:image/jpeg;base64,abc123', expected: true },
      { input: 'abc123', expected: true },
      { input: 123, expected: false },
      { input: {}, expected: false }
    ];
    
    testCases.forEach((testCase, index) => {
      const result = validateImageData(testCase.input);
      const passed = result === testCase.expected;
      
      console.log(`验证测试 ${index + 1}: ${passed ? '✅' : '❌'}`);
      if (!passed) {
        console.log(`  输入: ${JSON.stringify(testCase.input)}`);
        console.log(`  期望: ${testCase.expected}`);
        console.log(`  实际: ${result}`);
        allPassed = false;
      }
    });
    
  } catch (error) {
    console.error('错误处理测试失败:', error.message);
    allPassed = false;
  }
  
  if (allPassed) {
    console.log('✅ 错误处理测试通过');
  } else {
    console.log('❌ 错误处理测试失败');
  }
  
  return allPassed;
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('================================');
  console.log('开始运行本地兼容性修复测试');
  console.log('================================');
  
  const results = {
    imageExtension: testImageExtension(),
    base64Cleanup: testBase64Cleanup(),
    arrayBufferToBase64: testArrayBufferToBase64(),
    apiIntegration: testApiIntegration(),
    errorHandling: testErrorHandling()
  };
  
  console.log('');
  console.log('================================');
  console.log('测试结果汇总');
  console.log('================================');
  
  Object.entries(results).forEach(([testName, result]) => {
    console.log(`${testName}: ${result ? '✅ 通过' : '❌ 失败'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
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
  testImageExtension,
  testBase64Cleanup,
  testArrayBufferToBase64,
  testApiIntegration,
  testErrorHandling,
  runAllTests
};