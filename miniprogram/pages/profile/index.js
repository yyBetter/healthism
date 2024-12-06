Page({
  data: {
    userInfo: {},
    healthProfile: {},
    weightGoal: null,
    dailyStats: {},
    weightGoalStartDate: '',
    weightLost: 0,
    daysRemaining: 0,
    weightProgress: 0
  },

  onShow() {
    this.loadUserProfile()
  },

  loadUserProfile() {
    const app = getApp()
    const profile = app.getUserFullProfile()
    
    if (profile) {
      const { userInfo, healthProfile, weightGoal, dailyStats } = profile
      
      this.setData({
        userInfo,
        healthProfile,
        weightGoal,
        dailyStats
      })

      if (weightGoal) {
        this.calculateWeightProgress(weightGoal, healthProfile.weight)
      }
    }
  },

  calculateWeightProgress(goal, currentWeight) {
    // 计算开始日期
    const startDate = new Date(goal.startDate)
    const weightGoalStartDate = `${startDate.getMonth() + 1}月${startDate.getDate()}日`
    
    // 计算已减重
    const weightLost = goal.currentWeight - currentWeight
    
    // 计算剩余天数
    const now = new Date().getTime()
    const daysRemaining = Math.max(0, Math.ceil((goal.endDate - now) / (24 * 60 * 60 * 1000)))
    
    // 计算进度
    const totalToLose = goal.currentWeight - goal.targetWeight
    const weightProgress = Math.min(100, (weightLost / totalToLose) * 100)

    this.setData({
      weightGoalStartDate,
      weightLost: weightLost.toFixed(1),
      daysRemaining,
      weightProgress: weightProgress.toFixed(1)
    })
  },

  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit'
    })
  }
}) 