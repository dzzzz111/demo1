"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isLogin: false,
      userInfo: {
        name: "张三",
        avatar: "",
        tagline: "健康生活，从我做起",
        vipLevel: 1,
        vipEndDate: "2023-12-31"
      },
      healthData: {
        steps: "8,432",
        sleepHours: "7.5",
        heartRate: "72",
        bloodPressure: "120/80"
      },
      statusBarHeight: 20
      // 默认值
    };
  },
  computed: {
    vipLevelText() {
      const levelMap = {
        1: "普通会员",
        2: "高级会员",
        3: "VIP会员"
      };
      return levelMap[this.userInfo.vipLevel] || "普通会员";
    }
  },
  onShow() {
    this.checkLoginStatus();
  },
  onLoad() {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      this.isLogin = !!token;
      if (this.isLogin) {
        this.getUserInfo();
      }
    },
    getUserInfo() {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          this.userInfo = userInfo;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/mine/index.vue:233", "Parse userInfo error:", e);
        }
      }
    },
    navigateTo(url) {
      const existingPages = ["/pages/mine/login"];
      if (existingPages.includes(url)) {
        common_vendor.index.navigateTo({
          url
        });
      } else {
        common_vendor.index.showToast({
          title: "功能开发中",
          icon: "none",
          duration: 2e3
        });
      }
    },
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            this.isLogin = false;
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isLogin
  }, !$data.isLogin ? {
    b: common_assets._imports_0$2,
    c: common_vendor.o(($event) => $options.navigateTo("/pages/mine/login"))
  } : common_vendor.e({
    d: $data.userInfo.avatar || "/static/images/default-avatar.png",
    e: common_vendor.t($data.userInfo.name),
    f: common_vendor.t($data.userInfo.tagline || "暂无个性签名"),
    g: $data.userInfo.vipLevel > 0
  }, $data.userInfo.vipLevel > 0 ? {
    h: common_vendor.t($options.vipLevelText),
    i: common_vendor.t($data.userInfo.vipEndDate)
  } : {}), {
    j: $data.isLogin
  }, $data.isLogin ? {
    k: common_vendor.t($data.healthData.steps),
    l: common_vendor.t($data.healthData.sleepHours),
    m: common_vendor.t($data.healthData.heartRate),
    n: common_vendor.t($data.healthData.bloodPressure)
  } : {}, {
    o: $data.isLogin
  }, $data.isLogin ? {
    p: common_vendor.o(($event) => $options.navigateTo("/pages/mine/medical-record")),
    q: common_vendor.o(($event) => $options.navigateTo("/pages/mine/examination")),
    r: common_vendor.o(($event) => $options.navigateTo("/pages/mine/medication"))
  } : {}, {
    s: common_vendor.o(($event) => $options.navigateTo("/pages/ai-doctor/history")),
    t: common_vendor.o(($event) => $options.navigateTo("/pages/image-diagnose/history")),
    v: common_vendor.o(($event) => $options.navigateTo("/pages/mine/settings")),
    w: common_vendor.o(($event) => $options.navigateTo("/pages/mine/about")),
    x: common_vendor.o(($event) => $options.navigateTo("/pages/mine/feedback")),
    y: $data.isLogin
  }, $data.isLogin ? {
    z: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map
