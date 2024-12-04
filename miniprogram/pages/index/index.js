Page({
  data: {
    motto: 'Healthism',
    userInfo: {},
    hasUserInfo: false
  },
  
  onLoad() {
    // 页面加载时执行
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
      this.switchToHome()
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', res.userInfo)
        
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        // 跳转到主页
        this.switchToHome()
      },
      fail: (err) => {
        wx.showToast({
          title: '请授权用户信息',
          icon: 'none'
        })
      }
    })
  },

  // 跳转到主页
  switchToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
}) 