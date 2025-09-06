"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      loginType: "password",
      // password: 密码登录, code: 验证码登录
      passwordForm: {
        username: "",
        password: ""
      },
      codeForm: {
        phone: "",
        code: ""
      },
      showPassword: false,
      rememberPwd: false,
      agreeProtocol: true,
      codeText: "获取验证码",
      codeBtnDisabled: false,
      countDown: 60,
      statusBarHeight: 20
      // 默认值
    };
  },
  onLoad() {
    const savedAccount = common_vendor.index.getStorageSync("remember_account");
    if (savedAccount) {
      this.passwordForm = JSON.parse(savedAccount);
      this.rememberPwd = true;
    }
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    // 切换登录方式
    switchLoginType(type) {
      this.loginType = type;
    },
    // 切换密码显示/隐藏
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    // 切换记住密码
    toggleRememberPwd() {
      this.rememberPwd = !this.rememberPwd;
    },
    // 切换同意协议
    toggleAgreement() {
      this.agreeProtocol = !this.agreeProtocol;
    },
    // 发送验证码
    sendCode() {
      if (this.codeBtnDisabled)
        return;
      if (!this.codeForm.phone || !/^1\d{10}$/.test(this.codeForm.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      this.codeBtnDisabled = true;
      this.codeText = `${this.countDown}s`;
      const timer = setInterval(() => {
        this.countDown--;
        this.codeText = `${this.countDown}s`;
        if (this.countDown <= 0) {
          clearInterval(timer);
          this.codeBtnDisabled = false;
          this.codeText = "获取验证码";
          this.countDown = 60;
        }
      }, 1e3);
      common_vendor.index.showToast({
        title: "验证码已发送",
        icon: "success"
      });
    },
    // 登录
    login() {
      if (!this.agreeProtocol) {
        common_vendor.index.showToast({
          title: "请先同意用户协议和隐私政策",
          icon: "none"
        });
        return;
      }
      if (this.loginType === "password") {
        if (!this.passwordForm.username || !this.passwordForm.password) {
          common_vendor.index.showToast({
            title: "请输入用户名和密码",
            icon: "none"
          });
          return;
        }
        if (this.rememberPwd) {
          common_vendor.index.setStorageSync("remember_account", JSON.stringify(this.passwordForm));
        } else {
          common_vendor.index.removeStorageSync("remember_account");
        }
      } else {
        if (!this.codeForm.phone || !/^1\d{10}$/.test(this.codeForm.phone)) {
          common_vendor.index.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return;
        }
        if (!this.codeForm.code || this.codeForm.code.length !== 6) {
          common_vendor.index.showToast({
            title: "请输入6位验证码",
            icon: "none"
          });
          return;
        }
      }
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.setStorageSync("token", "mock_token_" + Date.now());
        common_vendor.index.setStorageSync("userInfo", JSON.stringify({
          name: "张三",
          avatar: "",
          tagline: "健康生活，从我做起",
          vipLevel: 1,
          vipEndDate: "2023-12-31"
        }));
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1e3);
    },
    // 其他登录方式
    otherLogin(type) {
      common_vendor.index.showToast({
        title: `${type === "wechat" ? "微信" : "支付宝"}登录功能开发中`,
        icon: "none"
      });
    },
    // 跳转到忘记密码页面
    navigateToForgetPwd() {
      common_vendor.index.showToast({
        title: "忘记密码功能开发中",
        icon: "none"
      });
    },
    // 跳转到注册页面
    navigateToRegister() {
      common_vendor.index.showToast({
        title: "注册功能开发中",
        icon: "none"
      });
    },
    // 查看协议
    viewProtocol(type) {
      common_vendor.index.showToast({
        title: `${type === "user" ? "用户协议" : "隐私政策"}功能开发中`,
        icon: "none"
      });
    },
    // 返回
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_assets._imports_0$3,
    d: $data.loginType === "password" ? 1 : "",
    e: common_vendor.o(($event) => $options.switchLoginType("password")),
    f: $data.loginType === "code" ? 1 : "",
    g: common_vendor.o(($event) => $options.switchLoginType("code")),
    h: $data.loginType === "password"
  }, $data.loginType === "password" ? {
    i: $data.passwordForm.username,
    j: common_vendor.o(($event) => $data.passwordForm.username = $event.detail.value),
    k: $data.showPassword ? "text" : "password",
    l: $data.passwordForm.password,
    m: common_vendor.o(($event) => $data.passwordForm.password = $event.detail.value),
    n: common_vendor.n($data.showPassword ? "icon-eye-open" : "icon-eye-close"),
    o: common_vendor.o((...args) => $options.togglePasswordVisibility && $options.togglePasswordVisibility(...args))
  } : {
    p: $data.codeForm.phone,
    q: common_vendor.o(($event) => $data.codeForm.phone = $event.detail.value),
    r: $data.codeForm.code,
    s: common_vendor.o(($event) => $data.codeForm.code = $event.detail.value),
    t: common_vendor.t($data.codeText),
    v: $data.codeBtnDisabled ? 1 : "",
    w: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args))
  }, {
    x: $data.loginType === "password"
  }, $data.loginType === "password" ? {
    y: $data.rememberPwd ? 1 : "",
    z: common_vendor.o((...args) => $options.toggleRememberPwd && $options.toggleRememberPwd(...args)),
    A: common_vendor.o((...args) => $options.navigateToForgetPwd && $options.navigateToForgetPwd(...args))
  } : {}, {
    B: common_vendor.o((...args) => $options.login && $options.login(...args)),
    C: common_vendor.o(($event) => $options.otherLogin("wechat")),
    D: common_vendor.o(($event) => $options.otherLogin("alipay")),
    E: common_vendor.o((...args) => $options.navigateToRegister && $options.navigateToRegister(...args)),
    F: $data.agreeProtocol ? 1 : "",
    G: common_vendor.o((...args) => $options.toggleAgreement && $options.toggleAgreement(...args)),
    H: common_vendor.o(($event) => $options.viewProtocol("user")),
    I: common_vendor.o(($event) => $options.viewProtocol("privacy"))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/login.js.map
