"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      diagnosisTypes: [
        { name: "骨关节炎MRI", hint: "上传膝关节核磁共振(MRI)图像进行骨关节炎分期诊断" }
      ],
      currentType: 0,
      imageUrl: "",
      diagnosisResult: null,
      currentTime: "",
      diagnosisHistory: [
        {
          id: 1,
          type: "骨关节炎MRI",
          imageUrl: "/static/sample-knee-mri.jpg",
          mainResult: "骨关节炎II期",
          time: "2023-10-15 14:30"
        }
      ],
      statusBarHeight: 20
      // 默认值
    };
  },
  onLoad() {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    selectType(index) {
      this.currentType = index;
    },
    takePhoto() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
        }
      });
    },
    selectImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
        }
      });
    },
    cancelImage() {
      this.imageUrl = "";
    },
    startDiagnosis() {
      common_vendor.index.showLoading({
        title: "正在诊断中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const stages = ["I", "II", "III", "IV"];
        const randomStage = stages[Math.floor(Math.random() * stages.length)];
        this.generateMockResult(randomStage);
        const now = /* @__PURE__ */ new Date();
        this.currentTime = `${now.getFullYear()}-${this.padZero(now.getMonth() + 1)}-${this.padZero(now.getDate())} ${this.padZero(now.getHours())}:${this.padZero(now.getMinutes())}`;
      }, 2e3);
    },
    generateMockResult(stage) {
      const stageResults = {
        "I": {
          items: [
            { name: "诊断结果", value: "膝关节骨关节炎 (97% 可信度)" },
            { name: "分期", value: "I期 (早期)" },
            { name: "部位", value: "膝关节内侧间隙" }
          ],
          analysis: "核磁共振图像显示膝关节软骨有轻微变化，软骨表面完整但有轻度信号异常。关节间隙基本正常，无明显骨髓水肿信号。半月板结构完整，韧带无异常。根据国际软骨修复学会(ICRS)分级标准，评估为I期(早期)骨关节炎。",
          suggestion: "建议适当控制体重，进行低强度有氧运动如游泳、骑自行车等。避免剧烈运动和长时间站立。可考虑口服软骨保护剂如氨糖和硫酸软骨素。定期随访，监测病情变化。"
        },
        "II": {
          items: [
            { name: "诊断结果", value: "膝关节骨关节炎 (98% 可信度)" },
            { name: "分期", value: "II期 (轻度)" },
            { name: "部位", value: "膝关节内侧间隙" }
          ],
          analysis: "核磁共振图像显示膝关节软骨有中度磨损，关节间隙轻度变窄。可见少量骨髓水肿信号，关节边缘有早期骨赘形成。半月板信号增强但结构完整。根据国际软骨修复学会(ICRS)分级标准，评估为II期(轻度)骨关节炎。",
          suggestion: "建议进行适当的关节保护，减轻体重负担，避免过度使用关节。可考虑物理治疗、非甾体抗炎药物和关节腔内注射透明质酸钠等治疗。建议定期随访，监测病情进展。"
        },
        "III": {
          items: [
            { name: "诊断结果", value: "膝关节骨关节炎 (99% 可信度)" },
            { name: "分期", value: "III期 (中度)" },
            { name: "部位", value: "膝关节内侧和外侧间隙" }
          ],
          analysis: "核磁共振图像显示膝关节软骨明显磨损，软骨下骨质暴露面积超过50%。关节间隙明显变窄，可见多处骨髓水肿信号。关节边缘有明显骨赘形成，半月板退变明显。根据国际软骨修复学会(ICRS)分级标准，评估为III期(中度)骨关节炎。",
          suggestion: "建议积极控制体重，使用拐杖等辅助工具减轻关节负担。可考虑关节腔内注射玻璃酸钠或糖皮质激素治疗。如保守治疗效果不佳，可考虑关节镜下清理或微骨折术等微创手术治疗。建议每3-6个月随访一次。"
        },
        "IV": {
          items: [
            { name: "诊断结果", value: "膝关节骨关节炎 (99% 可信度)" },
            { name: "分期", value: "IV期 (重度)" },
            { name: "部位", value: "膝关节全面受累" }
          ],
          analysis: "核磁共振图像显示膝关节软骨几乎完全磨损，软骨下骨质广泛暴露。关节间隙严重变窄，可见大面积骨髓水肿信号和囊性变。关节边缘有大量骨赘形成，半月板严重退变。根据国际软骨修复学会(ICRS)分级标准，评估为IV期(重度)骨关节炎。",
          suggestion: "建议考虑手术治疗，如人工膝关节置换术。术前可使用止痛药物和辅助工具减轻症状。术后需进行规范的康复训练。如不适合手术，可考虑支具固定、强化肌力训练和综合性疼痛管理。建议每3个月随访一次。"
        }
      };
      this.diagnosisResult = stageResults[stage];
    },
    resetDiagnosis() {
      this.imageUrl = "";
      this.diagnosisResult = null;
    },
    saveDiagnosis() {
      common_vendor.index.showToast({
        title: "已保存到诊断历史",
        icon: "success"
      });
      this.diagnosisHistory.unshift({
        id: Date.now(),
        type: this.diagnosisTypes[this.currentType].name,
        imageUrl: this.imageUrl,
        mainResult: this.diagnosisResult.items[0].value,
        time: this.currentTime
      });
      setTimeout(() => {
        this.resetDiagnosis();
      }, 1500);
    },
    viewAllHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/image-diagnose/history"
      });
    },
    viewHistoryDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/image-diagnose/detail?id=${item.id}`
      });
    },
    padZero(num) {
      return num < 10 ? `0${num}` : num;
    },
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1,
        fail: () => {
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.diagnosisTypes, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.currentType === index ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.selectType(index), index)
      };
    }),
    c: !$data.imageUrl && !$data.diagnosisResult
  }, !$data.imageUrl && !$data.diagnosisResult ? {
    d: common_vendor.o((...args) => $options.selectImage && $options.selectImage(...args))
  } : {}, {
    e: $data.imageUrl && !$data.diagnosisResult
  }, $data.imageUrl && !$data.diagnosisResult ? {
    f: $data.imageUrl,
    g: common_vendor.o((...args) => $options.cancelImage && $options.cancelImage(...args)),
    h: common_vendor.o((...args) => $options.startDiagnosis && $options.startDiagnosis(...args))
  } : {}, {
    i: $data.diagnosisResult
  }, $data.diagnosisResult ? {
    j: common_vendor.t($data.currentTime),
    k: $data.imageUrl,
    l: common_vendor.f($data.diagnosisResult.items, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.value),
        c: index
      };
    }),
    m: common_vendor.t($data.diagnosisResult.analysis),
    n: common_vendor.t($data.diagnosisResult.suggestion),
    o: common_vendor.o((...args) => $options.resetDiagnosis && $options.resetDiagnosis(...args)),
    p: common_vendor.o((...args) => $options.saveDiagnosis && $options.saveDiagnosis(...args))
  } : {}, {
    q: !$data.imageUrl && !$data.diagnosisResult && $data.diagnosisHistory.length > 0
  }, !$data.imageUrl && !$data.diagnosisResult && $data.diagnosisHistory.length > 0 ? {
    r: common_vendor.o((...args) => $options.viewAllHistory && $options.viewAllHistory(...args)),
    s: common_vendor.f($data.diagnosisHistory, (item, index, i0) => {
      return {
        a: common_vendor.t(item.type),
        b: item.imageUrl,
        c: common_vendor.t(item.mainResult),
        d: common_vendor.t(item.time),
        e: index,
        f: common_vendor.o(($event) => $options.viewHistoryDetail(item), index)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/image-diagnose/index.js.map
