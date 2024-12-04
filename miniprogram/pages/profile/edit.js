Page({
  data: {
    userInfo: {},
    genderOptions: ['男', '女'],
    genderIndex: 0,
    birthday: '2000-01-01',
    height: '',
    weight: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userInfo,
      genderIndex: userInfo.gender || 0,
      birthday: userInfo.birthday || '2000-01-01',
      height: userInfo.height || '',
      weight: userInfo.weight || ''
    })
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // TODO: 这里应该上传图片到服务器
        // 暂时只做本地展示
        const userInfo = this.data.userInfo
        userInfo.avatarUrl = res.tempFilePaths[0]
        this.setData({ userInfo })
      }
    })
  },

  // 输入昵称
  inputNickname(e) {
    const userInfo = this.data.userInfo
    userInfo.nickName = e.detail.value
    this.setData({ userInfo })
  },

  // 选择性别
  bindGenderChange(e) {
    this.setData({
      genderIndex: e.detail.value
    })
  },

  // 选择生日
  bindBirthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  // 输入身高
  inputHeight(e) {
    this.setData({
      height: e.detail.value
    })
  },

  // 输入体重
  inputWeight(e) {
    this.setData({
      weight: e.detail.value
    })
  },

  // 保存资料
  saveProfile() {
    if (!this.data.userInfo.nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '保存中...'
    })

    // 构建完整的用户信息
    const userInfo = {
      ...this.data.userInfo,
      gender: this.data.genderIndex,
      birthday: this.data.birthday,
      height: this.data.height,
      weight: this.data.weight
    }

    // TODO: 这里应该调用后端 API 保存用户信息
    // 暂时只保存到本地
    setTimeout(() => {
      wx.setStorageSync('userInfo', userInfo)
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    }, 1000)
  }
}) 