Page({
  data: {
    loading: false
  },

  // 处理微信登录
  handleWXLogin(e) {
    if (this.data.loading) return
    
    // 用户拒绝授权
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '需要授权才能使用',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({
      title: '登录中...'
    })

    // 获取用户信息
    const userInfo = e.detail.userInfo

    // 获取登录凭证
    wx.login({
      success: (res) => {
        if (res.code) {
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

            wx.hideLoading()
            this.setData({ loading: false })

            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500,
              success: () => {
                // 延迟返回，让用户看到成功提示
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
              }
            })
          }, 1000)
        } else {
          wx.hideLoading()
          this.setData({ loading: false })
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        this.setData({ loading: false })
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  }
}) 