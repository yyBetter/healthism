Page({
  data: {
    activeTab: 0,
    posts: [
      {
        id: 1,
        userInfo: {
          avatar: '/images/default-avatar.png',
          nickname: '健康达人'
        },
        content: '今天完成了5公里晨跑，感觉整个人都充满活力！💪',
        images: ['/images/post1.png'],
        likes: 128,
        comments: 32
      },
      {
        id: 2,
        userInfo: {
          avatar: '/images/default-avatar.png',
          nickname: '营养师小王'
        },
        content: '分享一个健康早餐搭配方案，营养美味不发胖~',
        images: ['/images/post2.png', '/images/post3.png'],
        likes: 256,
        comments: 45
      }
    ],
    activities: [
      {
        id: 1,
        title: '社区晨跑活动',
        date: '2024-03-01',
        location: '市民公园',
        participants: 42,
        maxParticipants: 50
      },
      {
        id: 2,
        title: '健康饮食讲座',
        date: '2024-03-05',
        location: '社区中心',
        participants: 28,
        maxParticipants: 30
      }
    ]
  },

  // 切换标签
  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ activeTab: index })
  },

  // 点赞
  likePost(e) {
    const { id } = e.currentTarget.dataset
    // TODO: 实现点赞功能
  },

  // 评论
  commentPost(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/post/detail?id=${id}`
    })
  },

  // 报名活动
  joinActivity(e) {
    const { id } = e.currentTarget.dataset
    // TODO: 实现活动报名功能
  }
}) 