"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      platform: "",
      screenWidth: 0,
      screenHeight: 0,
      clicked: false
    };
  },
  onLoad() {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.platform = systemInfo.platform;
    this.screenWidth = systemInfo.screenWidth;
    this.screenHeight = systemInfo.screenHeight;
    common_vendor.index.__f__("log", "at pages/test/index.vue:35", "测试页面加载成功", systemInfo);
  },
  methods: {
    testClick() {
      this.clicked = true;
      common_vendor.index.showToast({
        title: "测试成功！",
        icon: "success"
      });
      common_vendor.index.__f__("log", "at pages/test/index.vue:44", "按钮点击测试成功");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.platform),
    b: common_vendor.t($data.screenWidth),
    c: common_vendor.t($data.screenHeight),
    d: common_vendor.o((...args) => $options.testClick && $options.testClick(...args)),
    e: $data.clicked
  }, $data.clicked ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/test/index.js.map
