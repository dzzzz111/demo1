"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      bannerList: [
        {
          id: 1,
          title: "骨关节炎新疗法研究突破",
          image: "/static/images/news1.png"
        },
        {
          id: 2,
          title: "关节炎患者的运动指南",
          image: "/static/images/news2.png"
        },
        {
          id: 3,
          title: "饮食与骨关节炎的关系",
          image: "/static/images/news3.png"
        }
      ],
      doctorList: [
        {
          id: 1,
          name: "王医生",
          title: "主任医师",
          department: "骨科",
          avatar: "/static/images/ai-avatar.png",
          available: true
        },
        {
          id: 2,
          name: "李医生",
          title: "副主任医师",
          department: "内科",
          avatar: "/static/images/user-avatar.png",
          available: true
        },
        {
          id: 3,
          name: "张医生",
          title: "主治医师",
          department: "神经科",
          avatar: "/static/images/default-avatar.png",
          available: true
        },
        {
          id: 4,
          name: "刘医生",
          title: "主任医师",
          department: "康复科",
          avatar: "/static/images/ai-avatar.png",
          available: true
        }
      ],
      newsList: [
        {
          id: 1,
          title: "骨关节炎新疗法研究突破",
          description: "科学家发现可能逆转软骨损伤的再生技术",
          image: "/static/images/news1.png",
          time: "2023-10-18"
        },
        {
          id: 2,
          title: "关节炎患者的运动指南",
          description: "专家推荐的低冲击运动方式帮助缓解症状",
          image: "/static/images/news2.png",
          time: "2023-10-15"
        },
        {
          id: 3,
          title: "饮食与骨关节炎的关系",
          description: "最新研究揭示某些食物可能加重或缓解关节炎症状",
          image: "/static/images/news3.png",
          time: "2023-10-12"
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
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    viewNewsDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/news/detail?id=${item.id}`
      });
    },
    viewDoctorDetail(doctor) {
      common_vendor.index.navigateTo({
        url: `/pages/doctors/detail?id=${doctor.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.title),
        c: index,
        d: common_vendor.o(($event) => $options.viewNewsDetail(item), index)
      };
    }),
    b: common_assets._imports_0,
    c: common_vendor.o(($event) => $options.navigateTo("/pages/ai-doctor/index")),
    d: common_assets._imports_1,
    e: common_vendor.o(($event) => $options.navigateTo("/pages/image-diagnose/index")),
    f: common_vendor.o(($event) => $options.navigateTo("/pages/doctors/index")),
    g: common_vendor.f($data.doctorList, (doctor, index, i0) => {
      return common_vendor.e({
        a: doctor.avatar,
        b: doctor.available
      }, doctor.available ? {} : {}, {
        c: common_vendor.t(doctor.name),
        d: common_vendor.t(doctor.title),
        e: common_vendor.t(doctor.department),
        f: index,
        g: common_vendor.o(($event) => $options.viewDoctorDetail(doctor), index)
      });
    }),
    h: common_vendor.o(($event) => $options.navigateTo("/pages/news/index")),
    i: common_vendor.f($data.newsList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.description),
        d: common_vendor.t(item.time),
        e: index,
        f: common_vendor.o(($event) => $options.viewNewsDetail(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
