Page({
  data: {
    currentDate: '',
    dailyTarget: 0,
    totalIntake: 0,
    totalBurn: 0,
    remaining: 0,
    progressPercent: 0,
    currentMeal: 'breakfast',
    exercises: [],
    foods: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    },
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    proteinTarget: 0,
    carbsTarget: 0,
    fatTarget: 0
  },

  onLoad() {
    this.initDate()
    this.loadDailyTarget()
    this.loadRecords()
  },

  // 初始化日期
  initDate() {
    const now = new Date()
    const dateStr = this.formatDate(now)
    this.setData({ currentDate: dateStr })
  },

  // 加载每日目标
  loadDailyTarget() {
    const app = getApp()
    const weightGoal = app.getLatestWeightGoal()
    if (weightGoal) {
      this.setData({
        dailyTarget: weightGoal.suggestedIntake,
        proteinTarget: Math.round(app.globalData.healthProfile.weight * 2), // 2g/kg体重
        carbsTarget: Math.round(weightGoal.suggestedIntake * 0.5 / 4), // 50%能量来自碳水
        fatTarget: Math.round(weightGoal.suggestedIntake * 0.3 / 9) // 30%能量来自肪
      })
    }
  },

  // 加载当日记录
  loadRecords() {
    // TODO: 从本地存储或服务器加载当日运动和饮食记录
    this.calculateTotals()
  },

  // 计算总量
  calculateTotals() {
    // 计算运动消耗
    const totalBurn = this.data.exercises.reduce((sum, ex) => sum + ex.calories, 0)
    
    // 计算各餐饮食摄入
    let totalIntake = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    
    Object.values(this.data.foods).forEach(meals => {
      meals.forEach(food => {
        totalIntake += food.calories
        totalProtein += food.protein
        totalCarbs += food.carbs
        totalFat += food.fat
      })
    })

    // 计算剩余和进度
    const remaining = this.data.dailyTarget - totalIntake
    const progressPercent = Math.min(100, (totalIntake / this.data.dailyTarget) * 100)

    this.setData({
      totalBurn,
      totalIntake,
      remaining,
      progressPercent,
      totalProtein,
      totalCarbs,
      totalFat
    })
  },

  // 日期选择相关方法
  prevDay() {
    const date = new Date(this.data.currentDate)
    date.setDate(date.getDate() - 1)
    this.setData({ currentDate: this.formatDate(date) })
    this.loadRecords()
  },

  nextDay() {
    const date = new Date(this.data.currentDate)
    date.setDate(date.getDate() + 1)
    this.setData({ currentDate: this.formatDate(date) })
    this.loadRecords()
  },

  selectDate() {
    wx.showDatePicker({
      current: this.data.currentDate,
      success: (res) => {
        this.setData({ currentDate: res.date })
        this.loadRecords()
      }
    })
  },

  // 添加运动记录
  addExercise() {
    wx.navigateTo({
      url: '/pages/exercise/add'
    })
  },

  // 添加食物记录
  addFood() {
    wx.navigateTo({
      url: `/pages/food/add?meal=${this.data.currentMeal}`
    })
  },

  // 切换餐次
  switchMeal(e) {
    const meal = e.currentTarget.dataset.meal
    this.setData({ currentMeal: meal })
  },

  // 工具方法：格式化日期
  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  // 在 Page 中修改日期相关方法
  onDateChange(e) {
    const date = e.detail.date
    this.setData({
      currentDate: this.formatDate(date)
    })
    this.loadRecords()
  }
}) 