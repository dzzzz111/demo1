"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      message: "医疗助手已加载"
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/index/simple.vue:37", "简化首页加载成功");
    common_vendor.index.showToast({
      title: "页面加载成功",
      icon: "success"
    });
  },
  methods: {
    navigateTo(url) {
      common_vendor.index.__f__("log", "at pages/index/simple.vue:45", "导航到:", url);
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/simple.vue:49", "导航失败:", err);
          common_vendor.index.showToast({
            title: "页面开发中",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.navigateTo("/pages/ai-doctor/index")),
    b: common_vendor.o(($event) => $options.navigateTo("/pages/image-diagnose/index"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/simple.js.map
