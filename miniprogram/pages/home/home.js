Page({
  data: {
    isLogin: false,
    userInfo: {},
    goals: [
      { id: 1, title: '每日运动', target: '30分钟', progress: 60 },
      { id: 2, title: '喝水量', target: '2000ml', progress: 45 },
      { id: 3, title: '睡眠时间', target: '8小时', progress: 80 }
    ],
    todayStats: {
      steps: '--',
      calories: '--',
      distance: '--'
    }
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    // 每次页面显示时检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      })
      // 获取用户的健康数据
      this.getUserHealthData()
    } else {
      this.setData({
        isLogin: false,
        userInfo: {},
        todayStats: {
          steps: '--',
          calories: '--',
          distance: '--'
        }
      })
    }
  },

  // 获取用户健康数据
  getUserHealthData() {
    // 这里应该调用后端 API 获取真实数据
    // 目前使用模拟数据
    if (this.data.isLogin) {
      wx.showLoading({
        title: '加载中...'
      })

      // 模拟 API 请求
      setTimeout(() => {
        this.setData({
          todayStats: {
            steps: 6800,
            calories: 350,
            distance: 4.2
          }
        })
        wx.hideLoading()
      }, 500)
    }
  },

  // 处理登录
  handleLogin() {
    if (this.data.isLogin) return

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        wx.showLoading({
          title: '登录中...'
        })

        // 获取用户信息
        const userInfo = res.userInfo

        // 获取登录凭证
        wx.login({
          success: (loginRes) => {
            if (loginRes.code) {
              // TODO: 这里应该调用后端 API，用 code 换取用户的 openid 和 session_key
              // 目前模拟登录成功
              setTimeout(() => {
                // 补充用户 ID 等信息
                const fullUserInfo = {
                  ...userInfo,
                  userId: 'wx_' + Math.random().toString(36).substr(2, 9),
                  openid: 'mock_openid_' + Date.now()
                }

                // 保存用户信息
                wx.setStorageSync('userInfo', fullUserInfo)

                // 更新页面状态
                this.setData({
                  isLogin: true,
                  userInfo: fullUserInfo
                })

                // 获取用户健康数据
                this.getUserHealthData()

                wx.hideLoading()
                wx.showToast({
                  title: '登录成功',
                  icon: 'success'
                })
              }, 1000)
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          },
          fail: () => {
            wx.hideLoading()
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          }
        })
      },
      fail: () => {
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none'
        })
      }
    })
  },

  // 显示设置菜单
  showSettingsMenu() {
    wx.showActionSheet({
      itemList: ['编辑资料', '切换账号', '退出登录'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.editProfile()
            break
          case 1:
            this.switchAccount()
            break
          case 2:
            this.logout()
            break
        }
      }
    })
  },

  // 编辑个人资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit'
    })
  },

  // 切换账号
  switchAccount() {
    // 先退出当前账号
    this.logout()
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo')
          // 更新页面状态
          this.setData({
            isLogin: false,
            userInfo: {},
            todayStats: {
              steps: '--',
              calories: '--',
              distance: '--'
            }
          })
          // 提示用户
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  },

  // 添加新目标
  addNewGoal() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/goal/add'
    })
  },

  // 查看目标详情
  viewGoalDetail(e) {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/goal/detail?id=${id}`
    })
  }
}) 