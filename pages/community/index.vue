<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-bar">
        <text class="header-title">健康社区</text>
        <view class="header-actions">
          <view class="action-btn" @click="showSearch">
            <text class="iconfont">🔍</text>
          </view>
          <view class="action-btn" @click="showPublish">
            <text class="iconfont">✏️</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 分类标签 -->
    <view class="category-tabs">
      <scroll-view scroll-x class="tabs-scroll" show-scrollbar="false">
        <view class="tab-item" 
          v-for="(category, index) in categories" 
          :key="index"
          :class="{ active: currentCategory === category.id }"
          @click="switchCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>
    
    <!-- 帖子列表 -->
    <scroll-view scroll-y class="post-list" @scrolltolower="loadMorePosts">
      <view class="post-item" v-for="post in filteredPosts" :key="post.id" @click="viewPostDetail(post)">
        <!-- 用户信息 -->
        <view class="user-info">
          <image class="avatar" :src="post.userAvatar" mode="aspectFill"></image>
          <view class="user-meta">
            <text class="username">{{ post.username }}</text>
            <text class="post-time">{{ post.publishTime }}</text>
          </view>
          <view class="post-category" :style="{ backgroundColor: getCategoryColor(post.category) }">
            {{ post.categoryName }}
          </view>
        </view>
        
        <!-- 帖子内容 -->
        <view class="post-content">
          <text class="post-title">{{ post.title }}</text>
          <text class="post-text">{{ post.content }}</text>
        </view>
        
        <!-- 帖子图片 -->
        <view class="post-images" v-if="post.images && post.images.length > 0">
          <image 
            v-for="(image, index) in post.images.slice(0, 3)" 
            :key="index"
            class="post-image" 
            :src="image" 
            mode="aspectFill"
            @click.stop="previewImage(post.images, index)"
          ></image>
          <view class="more-images" v-if="post.images.length > 3" @click.stop="previewImage(post.images, 0)">
            <text class="more-text">+{{ post.images.length - 3 }}</text>
          </view>
        </view>
        
        <!-- 互动区域 -->
        <view class="post-actions">
          <view class="action-item" @click.stop="likePost(post)">
            <text class="action-icon">{{ post.isLiked ? '❤️' : '🤍' }}</text>
            <text class="action-count">{{ post.likes }}</text>
          </view>
          <view class="action-item" @click.stop="commentPost(post)">
            <text class="action-icon">💬</text>
            <text class="action-count">{{ post.comments }}</text>
          </view>
          <view class="action-item" @click.stop="sharePost(post)">
            <text class="action-icon">📤</text>
            <text class="action-count">{{ post.shares }}</text>
          </view>
          <view class="action-item" @click.stop="collectPost(post)">
            <text class="action-icon">{{ post.isCollected ? '⭐' : '☆' }}</text>
            <text class="action-count">{{ post.collects }}</text>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="loading-more" v-if="isLoading">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 没有更多数据 -->
      <view class="no-more" v-if="!hasMore && filteredPosts.length > 0">
        <text class="no-more-text">没有更多帖子了</text>
      </view>
    </scroll-view>
    
    <!-- 发布按钮 -->
    <view class="publish-btn" @click="showPublish">
      <text class="publish-icon">✏️</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      currentCategory: 'all',
      isLoading: false,
      hasMore: true,
      categories: [
        { id: 'all', name: '全部' },
        { id: 'disease', name: '疾病交流' },
        { id: 'treatment', name: '治疗经验' },
        { id: 'medicine', name: '用药咨询' },
        { id: 'rehabilitation', name: '康复分享' },
        { id: 'mental', name: '心理健康' },
        { id: 'nutrition', name: '营养饮食' },
        { id: 'exercise', name: '运动健身' }
      ],
      posts: [
        {
          id: 1,
          userId: 1,
          username: '健康小达人',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          title: '分享我的高血压控制经验',
          content: '经过半年的努力，我的血压终于稳定在正常范围了！主要方法包括：每天坚持30分钟有氧运动，控制盐分摄入，保持规律作息。最重要的是要按时服药，不能随意停药。希望我的经验能帮到大家！',
          category: 'disease',
          categoryName: '疾病交流',
          publishTime: '2小时前',
          likes: 156,
          comments: 23,
          shares: 12,
          collects: 45,
          isLiked: false,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 2,
          userId: 2,
          username: '康复之路',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          title: '膝关节手术后的康复训练',
          content: '刚刚做完膝关节镜手术，医生建议做一些康复训练。想请教一下有经验的朋友，康复期间需要注意什么？有哪些合适的训练动作？',
          category: 'rehabilitation',
          categoryName: '康复分享',
          publishTime: '4小时前',
          likes: 89,
          comments: 31,
          shares: 5,
          collects: 12,
          isLiked: true,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 3,
          userId: 3,
          username: '中医爱好者',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          title: '中医调理失眠的有效方法',
          content: '长期失眠困扰着我，试过很多方法。最近在看中医，医生建议我通过中药调理配合穴位按摩。每天晚上按揉神门穴、内关穴，效果还不错。大家有什么好的方法可以分享吗？',
          category: 'treatment',
          categoryName: '治疗经验',
          publishTime: '6小时前',
          likes: 234,
          comments: 67,
          shares: 28,
          collects: 89,
          isLiked: false,
          isCollected: true,
          images: []
        },
        {
          id: 4,
          userId: 4,
          username: '营养师小李',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          title: '糖尿病人的饮食指南',
          content: '作为营养师，我想给大家分享一些糖尿病人的饮食建议：1. 控制总热量摄入 2. 选择低GI食物 3. 少食多餐 4. 增加膳食纤维 5. 限制精制糖分。具体的食谱安排可以私信我哦！',
          category: 'nutrition',
          categoryName: '营养饮食',
          publishTime: '8小时前',
          likes: 312,
          comments: 45,
          shares: 56,
          collects: 127,
          isLiked: true,
          isCollected: true,
          images: [
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 5,
          userId: 5,
          username: '瑜伽爱好者',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          title: '瑜伽改善颈椎病的亲身体验',
          content: '长期伏案工作导致颈椎问题严重，朋友推荐练习瑜伽。坚持了3个月，颈椎疼痛明显缓解。推荐几个动作：猫牛式、眼镜蛇式、鱼式。每天20分钟，效果很棒！',
          category: 'exercise',
          categoryName: '运动健身',
          publishTime: '10小时前',
          likes: 178,
          comments: 29,
          shares: 15,
          collects: 67,
          isLiked: false,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1506629905743-9bc0f64195c4?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 6,
          userId: 6,
          username: '心理咨询师',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          title: '如何应对焦虑情绪',
          content: '很多朋友都有焦虑的困扰。分享几个缓解焦虑的方法：深呼吸练习、正念冥想、规律运动、充足睡眠、与朋友交流。如果焦虑严重影响生活，建议寻求专业帮助。',
          category: 'mental',
          categoryName: '心理健康',
          publishTime: '12小时前',
          likes: 289,
          comments: 52,
          shares: 34,
          collects: 98,
          isLiked: true,
          isCollected: false,
          images: []
        },
        {
          id: 7,
          userId: 7,
          username: '老药工',
          userAvatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&h=100&fit=crop&crop=face',
          title: '抗生素的正确使用方法',
          content: '看到很多朋友滥用抗生素，真的很担心。抗生素不是万能药，一定要在医生指导下使用。切记：1. 不要自行购买 2. 按时按量服用 3. 疗程要足够 4. 不要随意停药。',
          category: 'medicine',
          categoryName: '用药咨询',
          publishTime: '1天前',
          likes: 445,
          comments: 78,
          shares: 89,
          collects: 156,
          isLiked: false,
          isCollected: true,
          images: [
            'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 8,
          userId: 8,
          username: '跑步达人',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          title: '跑步对心脏健康的益处',
          content: '坚持跑步5年了，心脏功能越来越好的。跑步是最简单有效的有氧运动，能增强心肺功能，改善血液循环，降低心脏病风险。建议从慢跑开始，循序渐进。',
          category: 'exercise',
          categoryName: '运动健身',
          publishTime: '1天前',
          likes: 267,
          comments: 41,
          shares: 23,
          collects: 78,
          isLiked: true,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 9,
          userId: 9,
          username: '养生专家',
          userAvatar: 'https://images.unsplash.com/photo-1537511446984-935f9de4c245?w=100&h=100&fit=crop&crop=face',
          title: '四季养生小贴士',
          content: '春夏秋冬，养生方法各不相同。春天养肝，夏天养心，秋天养肺，冬天养肾。顺应自然规律，调整作息和饮食，才能达到最好的养生效果。',
          category: 'treatment',
          categoryName: '治疗经验',
          publishTime: '2天前',
          likes: 334,
          comments: 56,
          shares: 45,
          collects: 112,
          isLiked: false,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 10,
          userId: 10,
          username: '抗癌战士',
          userAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=100&h=100&fit=crop&crop=face',
          title: '抗癌路上的心理建设',
          content: '确诊癌症后，心理打击很大。但我想告诉大家，积极的心态对治疗很重要。家人朋友的支持、医生的专业治疗、自己的坚强意志，缺一不可。我们一起加油！',
          category: 'disease',
          categoryName: '疾病交流',
          publishTime: '2天前',
          likes: 567,
          comments: 89,
          shares: 67,
          collects: 234,
          isLiked: true,
          isCollected: true,
          images: []
        },
        {
          id: 11,
          userId: 11,
          username: '健身教练',
          userAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
          title: '办公室人群的健身建议',
          content: '很多上班族都有颈椎、腰椎问题。推荐几个办公室就能做的小动作：颈部转动、肩部放松、腰部扭转、手腕脚踝活动。每小时起身活动5分钟，对健康很有帮助。',
          category: 'exercise',
          categoryName: '运动健身',
          publishTime: '3天前',
          likes: 189,
          comments: 34,
          shares: 12,
          collects: 56,
          isLiked: false,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop'
          ]
        },
        {
          id: 12,
          userId: 12,
          username: '中医世家',
          userAvatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
          title: '艾灸养生的好处',
          content: '我们家几代都是中医，艾灸是很好的养生方法。可以温通经络、散寒除湿、调理气血。特别适合虚寒体质的朋友。但要注意艾灸的时间和频率，过量反而不好。',
          category: 'treatment',
          categoryName: '治疗经验',
          publishTime: '3天前',
          likes: 278,
          comments: 45,
          shares: 23,
          collects: 89,
          isLiked: true,
          isCollected: false,
          images: [
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
          ]
        }
      ]
    };
  },
  computed: {
    filteredPosts() {
      if (this.currentCategory === 'all') {
        return this.posts;
      }
      return this.posts.filter(post => post.category === this.currentCategory);
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
  },
  methods: {
    switchCategory(categoryId) {
      this.currentCategory = categoryId;
    },
    
    getCategoryColor(category) {
      const colors = {
        'disease': '#ff6b6b',
        'treatment': '#4ecdc4',
        'medicine': '#45b7d1',
        'rehabilitation': '#96ceb4',
        'mental': '#ffeaa7',
        'nutrition': '#fd79a8',
        'exercise': '#fdcb6e'
      };
      return colors[category] || '#ddd';
    },
    
    likePost(post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    },
    
    commentPost(post) {
      uni.showToast({
        title: '评论功能开发中',
        icon: 'none'
      });
    },
    
    sharePost(post) {
      uni.showActionSheet({
        itemList: ['分享给好友', '复制链接', '生成海报'],
        success: (res) => {
          const actions = ['分享给好友', '复制链接', '生成海报'];
          uni.showToast({
            title: `${actions[res.tapIndex]}功能开发中`,
            icon: 'none'
          });
        }
      });
    },
    
    collectPost(post) {
      post.isCollected = !post.isCollected;
      post.collects += post.isCollected ? 1 : -1;
      
      uni.showToast({
        title: post.isCollected ? '收藏成功' : '取消收藏',
        icon: 'success'
      });
    },
    
    viewPostDetail(post) {
      uni.navigateTo({
        url: `/pagesB/community/detail?id=${post.id}`
      });
    },
    
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      });
    },
    
    showSearch() {
      uni.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      });
    },
    
    showPublish() {
      uni.showToast({
        title: '发布功能开发中',
        icon: 'none'
      });
    },
    
    loadMorePosts() {
      if (this.isLoading || !this.hasMore) return;
      
      this.isLoading = true;
      
      // 模拟加载更多数据
      setTimeout(() => {
        this.isLoading = false;
        // 这里可以加载更多帖子数据
        uni.showToast({
          title: '没有更多数据了',
          icon: 'none'
        });
      }, 1000);
    }
  }
}
</script>

<style>
.container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部标题 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.3);
}

.status-bar {
  width: 100%;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.95);
  background-color: rgba(255, 255, 255, 0.35);
}

.action-btn text {
  font-size: 30rpx;
}

/* 分类标签 */
.category-tabs {
  background: linear-gradient(to bottom, #fff, #f8f9ff);
  padding: 25rpx 0;
  position: fixed;
  top: calc(var(--status-bar-height) + 88rpx);
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-bottom: 1rpx solid rgba(102, 126, 234, 0.1);
}

.tabs-scroll {
  white-space: nowrap;
  padding: 0 30rpx;
}

.tab-item {
  display: inline-block;
  padding: 12rpx 35rpx;
  margin-right: 20rpx;
  border-radius: 35rpx;
  font-size: 26rpx;
  color: #666;
  background: linear-gradient(135deg, #f8f9ff, #e8ecff);
  border: 2rpx solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 35rpx;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.tab-item.active {
  color: #fff;
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.4);
}

.tab-item.active::before {
  opacity: 1;
}

.tab-item:active {
  transform: scale(0.98);
}

/* 帖子列表 */
.post-list {
  margin-top: calc(var(--status-bar-height) + 88rpx + 140rpx);
  height: calc(100vh - var(--status-bar-height) - 88rpx - 140rpx);
  padding: 20rpx;
}

.post-item {
  background: linear-gradient(135deg, #fff, #f8f9ff);
  margin-bottom: 25rpx;
  padding: 35rpx;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid rgba(102, 126, 234, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.post-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.04);
}

.post-item:active::before {
  opacity: 1;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(102, 126, 234, 0.1);
}

.avatar {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  margin-right: 25rpx;
  border: 3rpx solid #fff;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar:active {
  transform: scale(1.1);
}

.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
}

.post-time {
  font-size: 24rpx;
  color: #888;
  background: linear-gradient(135deg, #f8f9ff, #e8ecff);
  padding: 4rpx 12rpx;
  border-radius: 15rpx;
  display: inline-block;
}

.post-category {
  padding: 8rpx 16rpx;
  border-radius: 25rpx;
  font-size: 22rpx;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15);
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.post-category:active {
  transform: scale(0.95);
}

/* 帖子内容 */
.post-content {
  margin-bottom: 25rpx;
}

.post-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
  line-height: 1.4;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2rpx 4rpx rgba(102, 126, 234, 0.1);
}

.post-text {
  font-size: 29rpx;
  color: #555;
  line-height: 1.7;
  display: block;
  background: linear-gradient(135deg, #555, #777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 帖子图片 */
.post-images {
  display: flex;
  gap: 15rpx;
  margin-bottom: 25rpx;
  flex-wrap: wrap;
}

.post-image {
  width: 210rpx;
  height: 210rpx;
  border-radius: 15rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2rpx solid rgba(255, 255, 255, 0.8);
}

.post-image:active {
  transform: scale(1.05);
  box-shadow: 0 12rpx 35rpx rgba(0, 0, 0, 0.25);
}

.more-images {
  width: 210rpx;
  height: 210rpx;
  border-radius: 15rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.4);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.more-images:active {
  transform: scale(1.05);
}

.more-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 互动区域 */
.post-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 25rpx;
  border-top: 1rpx solid rgba(102, 126, 234, 0.15);
  margin-top: 20rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 25rpx;
  border-radius: 30rpx;
  background: linear-gradient(135deg, #f8f9ff, #e8ecff);
  border: 1rpx solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120rpx;
  justify-content: center;
}

.action-item:active {
  transform: translateY(2rpx) scale(0.98);
  background: linear-gradient(135deg, #e8ecff, #d8e2ff);
  box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.2);
}

.action-icon {
  font-size: 30rpx;
  filter: drop-shadow(0 1rpx 2rpx rgba(0, 0, 0, 0.1));
}

.action-count {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  bottom: 120rpx;
  right: 40rpx;
  width: 110rpx;
  height: 110rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.5);
  z-index: 1001;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10rpx);
}

.publish-btn:active {
  transform: translateY(4rpx) scale(0.95);
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
}

.publish-icon {
  font-size: 44rpx;
  color: #fff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6rpx);
  }
}

/* 加载状态 */
.loading-more {
  text-align: center;
  padding: 50rpx;
  background: linear-gradient(135deg, #fff, #f8f9ff);
  border-radius: 20rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.loading-text {
  font-size: 26rpx;
  color: #888;
  font-weight: 500;
}

.no-more {
  text-align: center;
  padding: 50rpx;
  background: linear-gradient(135deg, #fff, #f8f9ff);
  border-radius: 20rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.no-more-text {
  font-size: 26rpx;
  color: #888;
  font-weight: 500;
}

/* 背景装饰 */
.container::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.03) 0%, transparent 70%);
  z-index: -1;
  animation: rotate 60s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>