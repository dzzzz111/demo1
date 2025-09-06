"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 20,
      messageList: [
        {
          type: "ai",
          content: "您好！我是您的AI医疗助手，请描述您的症状，我会为您提供专业的医疗建议。",
          time: this.getCurrentTime()
        }
      ],
      inputMessage: "",
      isLoading: false,
      scrollTop: 0
    };
  },
  onLoad() {
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    this.scrollToBottom();
  },
  methods: {
    // 发送消息
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading)
        return;
      const userMessage = this.inputMessage.trim();
      this.inputMessage = "";
      this.messageList.push({
        type: "user",
        content: userMessage,
        time: this.getCurrentTime()
      });
      this.scrollToBottom();
      this.isLoading = true;
      try {
        const aiResponse = await this.callAIModel(userMessage);
        this.messageList.push({
          type: "ai",
          content: aiResponse,
          time: this.getCurrentTime()
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ai-doctor/index.vue:144", "AI调用失败:", error);
        this.messageList.push({
          type: "ai",
          content: "抱歉，我暂时无法回答您的问题，请稍后再试。",
          time: this.getCurrentTime()
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    // 调用大模型API
    async callAIModel(message) {
      this.messageList.slice(-10).filter((msg) => msg.type !== "system");
      const responses = [
        "根据您描述的症状，建议您注意休息，多喝水。如果症状持续，请及时就医。",
        "这种情况可能是由多种原因引起的，建议您保持良好的作息习惯，如有不适请咨询专业医生。",
        "感谢您的咨询，根据您的描述，建议您先观察症状变化，必要时到医院进行检查。",
        "您提到的症状需要进一步观察，建议您记录症状变化情况，如有加重请及时就医。"
      ];
      await new Promise((resolve) => setTimeout(resolve, 1e3 + Math.random() * 2e3));
      return responses[Math.floor(Math.random() * responses.length)];
    },
    // 获取当前时间
    getCurrentTime() {
      const now = /* @__PURE__ */ new Date();
      return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    },
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 999999;
      });
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
    b: common_vendor.f($data.messageList, (message, index, i0) => {
      return common_vendor.e({
        a: message.type === "user"
      }, message.type === "user" ? {
        b: common_vendor.t(message.content),
        c: common_assets._imports_0$1
      } : {
        d: common_assets._imports_1$1,
        e: common_vendor.t(message.content),
        f: common_vendor.t(message.time)
      }, {
        g: index
      });
    }),
    c: $data.isLoading
  }, $data.isLoading ? {
    d: common_assets._imports_1$1
  } : {}, {
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    g: $data.inputMessage,
    h: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    i: common_vendor.t($data.inputMessage.length),
    j: !$data.inputMessage.trim() || $data.isLoading ? 1 : "",
    k: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ai-doctor/index.js.map
