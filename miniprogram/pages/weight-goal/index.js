Page({
  data: {
    healthProfile: {},
    targetWeight: '',
    periodOptions: ['4周', '8周', '12周', '16周'],
    periodIndex: 1,
    showPlan: false,
    weightToLose: 0,
    weeklyGoal: 0,
    dailyDeficit: 0,
    suggestedIntake: 0,
    bmi: null,
    bmiStatus: {},
    healthyWeightRange: null,
    isTargetHealthy: true,
    isHealthyPlan: true,
    days: 56
  },

  onLoad() {
    this.loadHealthProfile()
    this.setData({ days: 56 })
  },

  loadHealthProfile() {
    const app = getApp()
    const healthProfile = app.globalData.healthProfile
    this.setData({ healthProfile })
    this.calculateBMI()
    this.calculateHealthyWeightRange()
  },

  calculateBMI() {
    const { height, weight } = this.data.healthProfile
    if (!height || !weight) return

    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let status = {
      text: '正常',
      class: 'normal'
    }

    if (bmi < 18.5) {
      status = { text: '偏瘦', class: 'underweight' }
    } else if (bmi >= 25) {
      status = { text: '偏重', class: 'overweight' }
    }

    this.setData({
      bmi: bmi.toFixed(1),
      bmiStatus: status
    })
  },

  calculateHealthyWeightRange() {
    const { height } = this.data.healthProfile
    if (!height) return

    const heightInMeters = height / 100
    const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1)
    const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1)

    this.setData({
      healthyWeightRange: {
        min: minWeight,
        max: maxWeight
      }
    })
  },

  onTargetWeightInput(e) {
    const targetWeight = e.detail.value
    this.setData({ targetWeight })
    this.checkTargetWeight(targetWeight)
    this.calculatePlan()
  },

  checkTargetWeight(targetWeight) {
    const { healthyWeightRange } = this.data
    if (!healthyWeightRange || !targetWeight) return

    const isTargetHealthy = 
      targetWeight >= healthyWeightRange.min && 
      targetWeight <= healthyWeightRange.max

    this.setData({ isTargetHealthy })
  },

  onDaysChange(e) {
    const days = e.detail.value
    this.setData({ 
      days,
      periodIndex: Math.floor((days - 28) / 28)
    })
    this.calculatePlan()
  },

  calculatePlan() {
    const { targetWeight, days, healthProfile } = this.data
    if (!targetWeight || !healthProfile.weight) return

    const currentWeight = healthProfile.weight
    const weightToLose = currentWeight - targetWeight
    const weeks = days / 7
    const weeklyGoal = weightToLose / weeks
    
    // 1kg脂肪约等于7700千卡
    const dailyDeficit = Math.round((weeklyGoal * 7700) / 7)
    const suggestedIntake = healthProfile.tdee - dailyDeficit

    const isHealthyPlan = weeklyGoal <= 0.5 && dailyDeficit <= 500

    this.setData({
      showPlan: true,
      weightToLose: weightToLose.toFixed(1),
      weeklyGoal: weeklyGoal.toFixed(2),
      dailyDeficit,
      suggestedIntake: Math.max(1200, suggestedIntake),
      isHealthyPlan
    })
  },

  saveWeightGoal() {
    if (!this.data.isHealthyPlan) {
      wx.showModal({
        title: '提示',
        content: '当前计划可能过于激进，建议适当延长减重周期，确保健康减重。是否继续？',
        success: (res) => {
          if (res.confirm) {
            this.doSaveGoal()
          }
        }
      })
    } else {
      this.doSaveGoal()
    }
  },

  doSaveGoal() {
    const { targetWeight, weightToLose, weeklyGoal, dailyDeficit, suggestedIntake, days } = this.data
    
    const goal = {
      type: 'weight',
      currentWeight: this.data.healthProfile.weight,
      targetWeight: Number(targetWeight),
      weightToLose: Number(weightToLose),
      weeklyGoal: Number(weeklyGoal),
      dailyDeficit,
      suggestedIntake,
      startDate: new Date().getTime(),
      endDate: new Date().getTime() + days * 24 * 60 * 60 * 1000
    }

    const app = getApp()
    if (app.saveWeightGoal(goal)) {
      wx.showToast({
        title: '计划已保存',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    }
  }
}) 