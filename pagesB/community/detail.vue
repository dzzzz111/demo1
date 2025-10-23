<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="iconfont">‹</text>
        </view>
        <text class="header-title">帖子详情</text>
        <view class="header-actions">
          <view class="action-btn" @click="sharePost">
            <text class="iconfont">📤</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 帖子内容 -->
    <scroll-view scroll-y class="post-content" v-if="post">
      <!-- 用户信息 -->
      <view class="user-info">
        <image class="avatar" :src="post.userAvatar" mode="aspectFill"></image>
        <view class="user-meta">
          <text class="username">{{ post.username }}</text>
          <text class="post-time">{{ post.publishTime }}</text>
        </view>
        <view class="follow-btn" @click="followUser">
          <text class="follow-text">+ 关注</text>
        </view>
      </view>
      
      <!-- 帖子标题和内容 -->
      <view class="post-detail">
        <view class="post-category" :style="{ backgroundColor: getCategoryColor(post.category) }">
          {{ post.categoryName }}
        </view>
        <text class="post-title">{{ post.title }}</text>
        <text class="post-text">{{ post.content }}</text>
        
        <!-- 帖子图片 -->
        <view class="post-images" v-if="post.images && post.images.length > 0">
          <image 
            v-for="(image, index) in post.images" 
            :key="index"
            class="post-image" 
            :src="image" 
            mode="aspectFill"
            @click="previewImage(post.images, index)"
          ></image>
        </view>
      </view>
      
      <!-- 互动区域 -->
      <view class="post-actions">
        <view class="action-item" @click="likePost">
          <text class="action-icon">{{ post.isLiked ? '❤️' : '🤍' }}</text>
          <text class="action-count">{{ post.likes }}</text>
        </view>
        <view class="action-item" @click="showComments">
          <text class="action-icon">💬</text>
          <text class="action-count">{{ post.comments }}</text>
        </view>
        <view class="action-item" @click="sharePost">
          <text class="action-icon">📤</text>
          <text class="action-count">{{ post.shares }}</text>
        </view>
        <view class="action-item" @click="collectPost">
          <text class="action-icon">{{ post.isCollected ? '⭐' : '☆' }}</text>
          <text class="action-count">{{ post.collects }}</text>
        </view>
      </view>
      
      <!-- 评论区 -->
      <view class="comments-section">
        <view class="section-title">
          <text class="title-text">评论 ({{ post.comments }})</text>
        </view>
        
        <view class="comment-item" v-for="comment in comments" :key="comment.id">
          <image class="comment-avatar" :src="comment.userAvatar" mode="aspectFill"></image>
          <view class="comment-content">
            <view class="comment-header">
              <text class="comment-username">{{ comment.username }}</text>
              <text class="comment-time">{{ comment.time }}</text>
            </view>
            <text class="comment-text">{{ comment.content }}</text>
            <view class="comment-actions">
              <text class="comment-action" @click="likeComment(comment)">
                {{ comment.isLiked ? '❤️' : '🤍' }} {{ comment.likes }}
              </text>
              <text class="comment-action" @click="replyComment(comment)">回复</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 相关推荐 -->
      <view class="recommend-section">
        <view class="section-title">
          <text class="title-text">相关推荐</text>
        </view>
        <view class="recommend-item" v-for="item in recommendPosts" :key="item.id" @click="viewPost(item)">
          <image class="recommend-image" :src="item.userAvatar" mode="aspectFill"></image>
          <view class="recommend-info">
            <text class="recommend-title">{{ item.title }}</text>
            <text class="recommend-desc">{{ item.username }} · {{ item.publishTime }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部评论输入 -->
    <view class="bottom-input">
      <input 
        class="comment-input" 
        v-model="commentText"
        placeholder="写下你的评论..."
        @confirm="submitComment"
      />
      <view class="send-btn" @click="submitComment">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      postId: null,
      post: null,
      commentText: '',
      comments: [
        {
          id: 1,
          userId: 1,
          username: '热心网友',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
          content: '感谢分享，很有帮助！我也一直在寻找控制血压的好方法。',
          time: '1小时前',
          likes: 12,
          isLiked: false
        },
        {
          id: 2,
          userId: 2,
          username: '医学博士',
          userAvatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face',
          content: '建议在医生指导下进行，每个人的情况不同，需要个性化治疗方案。',
          time: '30分钟前',
          likes: 8,
          isLiked: true
        },
        {
          id: 3,
          userId: 3,
          username: '健康生活家',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          content: '我也有类似的经历，确实坚持运动很重要。推荐试试游泳和瑜伽。',
          time: '15分钟前',
          likes: 5,
          isLiked: false
        }
      ],
      recommendPosts: []
    };
  },
  onLoad(options) {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    
    if (options.id) {
      this.postId = parseInt(options.id);
      this.loadPost();
    }
    
    this.loadRecommendPosts();
  },
  methods: {
    loadPost() {
      // 模拟从列表数据中获取帖子详情
      const mockPosts = [
        {
          id: 1,
          userId: 1,
          username: '健康小达人',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          title: '分享我的高血压控制经验',
          content: '经过半年的努力，我的血压终于稳定在正常范围了！主要方法包括：每天坚持30分钟有氧运动，控制盐分摄入，保持规律作息。最重要的是要按时服药，不能随意停药。希望我的经验能帮到大家！\n\n刚开始确诊高血压时，我也很焦虑。但在医生的指导下，我逐渐找到了适合自己的控制方法。除了药物治疗，生活方式的调整也很重要。\n\n运动方面，我选择的是快走和游泳，都是对心脏很好的有氧运动。饮食上，我减少了盐的摄入，增加了蔬菜水果的比例。作息方面，尽量保证每天7-8小时的睡眠。\n\n最重要的是要保持良好的心态，不要因为血压问题而过度焦虑。定期监测血压，及时调整治疗方案。',
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
        }
      ];
      
      this.post = mockPosts.find(p => p.id === this.postId);
    },
    
    loadRecommendPosts() {
      this.recommendPosts = [
        {
          id: 2,
          title: '膝关节手术后的康复训练',
          username: '康复之路',
          publishTime: '4小时前',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
        },
        {
          id: 3,
          title: '中医调理失眠的有效方法',
          username: '中医爱好者',
          publishTime: '6小时前',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
        }
      ];
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
    
    likePost() {
      this.post.isLiked = !this.post.isLiked;
      this.post.likes += this.post.isLiked ? 1 : -1;
    },
    
    commentPost() {
      this.showComments();
    },
    
    sharePost() {
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
    
    collectPost() {
      this.post.isCollected = !this.post.isCollected;
      this.post.collects += this.post.isCollected ? 1 : -1;
      
      uni.showToast({
        title: this.post.isCollected ? '收藏成功' : '取消收藏',
        icon: 'success'
      });
    },
    
    followUser() {
      uni.showToast({
        title: '关注成功',
        icon: 'success'
      });
    },
    
    showComments() {
      // 滚动到评论区
      uni.createSelectorQuery()
        .select('.comments-section')
        .boundingClientRect(data => {
          uni.pageScrollTo({
            scrollTop: data.top,
            duration: 300
          });
        })
        .exec();
    },
    
    likeComment(comment) {
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
    },
    
    replyComment(comment) {
      this.commentText = `@${comment.username} `;
    },
    
    submitComment() {
      if (!this.commentText.trim()) {
        uni.showToast({
          title: '请输入评论内容',
          icon: 'none'
        });
        return;
      }
      
      const newComment = {
        id: this.comments.length + 1,
        userId: 999,
        username: '我',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
        content: this.commentText,
        time: '刚刚',
        likes: 0,
        isLiked: false
      };
      
      this.comments.unshift(newComment);
      this.post.comments++;
      this.commentText = '';
      
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      });
    },
    
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      });
    },
    
    viewPost(post) {
      uni.redirectTo({
        url: `/pages/community/detail?id=${post.id}`
      });
    },
    
    goBack() {
      uni.navigateBack();
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
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn text {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.action-btn text {
  font-size: 28rpx;
}

/* 帖子内容 */
.post-content {
  margin-top: calc(var(--status-bar-height) + 88rpx);
  height: calc(100vh - var(--status-bar-height) - 88rpx - 120rpx);
  padding-bottom: 20rpx;
}

/* 用户信息 */
.user-info {
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

.follow-btn {
  padding: 10rpx 30rpx;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  border-radius: 30rpx;
}

.follow-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: 500;
}

/* 帖子详情 */
.post-detail {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.post-category {
  display: inline-block;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #fff;
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
  line-height: 1.4;
}

.post-text {
  font-size: 30rpx;
  color: #666;
  line-height: 1.8;
  display: block;
  margin-bottom: 30rpx;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.post-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
}

/* 互动区域 */
.post-actions {
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.action-icon {
  font-size: 32rpx;
}

.action-count {
  font-size: 26rpx;
  color: #999;
}

/* 评论区 */
.comments-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.comment-item {
  display: flex;
  margin-bottom: 30rpx;
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.comment-username {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
}

.comment-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15rpx;
  display: block;
}

.comment-actions {
  display: flex;
  gap: 30rpx;
}

.comment-action {
  font-size: 24rpx;
  color: #999;
}

/* 相关推荐 */
.recommend-section {
  background-color: #fff;
  padding: 30rpx;
}

.recommend-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.recommend-item:last-child {
  border-bottom: none;
}

.recommend-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.recommend-info {
  flex: 1;
}

.recommend-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.recommend-desc {
  font-size: 24rpx;
  color: #999;
}

/* 底部输入 */
.bottom-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.comment-input {
  flex: 1;
  height: 80rpx;
  background-color: #f5f7fa;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.send-btn {
  padding: 15rpx 40rpx;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  border-radius: 30rpx;
}

.send-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}
</style>