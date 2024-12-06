Page({
  data: {
    userInfo: {},
    genderOptions: ['请选择', '男', '女'],
    genderIndex: 0,
    birthday: '2000-01-01',
    height: '',
    weight: '',
    activityLevelOptions: [
      '请选择运动习惯',
      '久坐少动（每周运动0-1次）',
      '轻度活动（每周运动2-3次）',
      '中度活动（每周运动4-5次）'
    ],
    activityLevelIndex: 0,
    bmr: null,
    tdee: null
  },

  onLoad() {
    // 加载用户基本信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
    
    // 加载健康档案
    this.loadUserProfile()
    this.getDeviceHealthData()
  },

  // 加载用户档案
  async loadUserProfile() {
    const app = getApp()
    const healthProfile = app.globalData.healthProfile
    
    console.log('当前健康档案:', healthProfile) // 调试日志
    
    if (healthProfile) {
      this.setData({
        genderIndex: healthProfile.gender === 'male' ? 1 : (healthProfile.gender === 'female' ? 2 : 0),
        height: healthProfile.height || '',
        weight: healthProfile.weight || '',
        activityLevelIndex: healthProfile.activityLevel || 0,
        birthday: healthProfile.birthday || '2000-01-01'
      })
      this.calculateMetrics()
    }
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          'userInfo.avatarUrl': tempFilePath
        })
      }
    })
  },

  // 输入昵称
  inputNickname(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    })
  },

  // 获取设备健康数据
  async getDeviceHealthData() {
    try {
      const app = getApp()
      const healthData = await app.getDeviceHealthData()
      console.log('设备健康数据:', healthData)
    } catch (error) {
      console.error('获取设备健康数据失败:', error)
      wx.showToast({
        title: '获取运动数据失败',
        icon: 'none'
      })
    }
  },

  // 计算BMR和TDEE
  calculateMetrics() {
    const { genderIndex, height, weight, birthday, activityLevelIndex } = this.data
    if (genderIndex === 0 || !height || !weight || !birthday || activityLevelIndex === 0) {
      return
    }

    const age = this.calculateAge(birthday)
    const gender = genderIndex === 1 ? 'male' : 'female'
    const profile = { gender, age, height: Number(height), weight: Number(weight) }
    
    const app = getApp()
    const bmr = Math.round(app.calculateBMR(profile))
    const tdee = Math.round(app.calculateTDEE(bmr, activityLevelIndex))

    this.setData({ bmr, tdee })
  },

  calculateAge(birthday) {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  },

  // 表单事件处理
  bindGenderChange(e) {
    this.setData({ genderIndex: Number(e.detail.value) })
    this.calculateMetrics()
  },

  bindActivityLevelChange(e) {
    this.setData({ activityLevelIndex: Number(e.detail.value) })
    this.calculateMetrics()
  },

  bindBirthdayChange(e) {
    this.setData({ birthday: e.detail.value })
    this.calculateMetrics()
  },

  inputHeight(e) {
    this.setData({ height: e.detail.value })
    this.calculateMetrics()
  },

  inputWeight(e) {
    this.setData({ weight: e.detail.value })
    this.calculateMetrics()
  },

  // 保存个人信息
  async saveProfile() {
    const { genderIndex, height, weight, birthday, activityLevelIndex, bmr, tdee } = this.data
    
    if (genderIndex === 0 || !height || !weight || activityLevelIndex === 0) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const app = getApp()
    const healthProfile = {
      gender: genderIndex === 1 ? 'male' : 'female',
      age: this.calculateAge(birthday),
      height: Number(height),
      weight: Number(weight),
      activityLevel: activityLevelIndex,
      bmr,
      tdee,
      birthday
    }

    if (app.saveHealthProfile(healthProfile)) {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
      app.updateBodyInfo(true)
    } else {
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      })
    }
  },

  handleUpdate(e) {
    const hasChanges = e.currentTarget.dataset.hasChanges
    if (hasChanges) {
      this.saveProfile()
    } else {
      const app = getApp()
      app.updateBodyInfo(false)
      wx.navigateBack()
    }
  }
}) 