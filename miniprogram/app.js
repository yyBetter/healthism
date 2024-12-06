App({
  onLaunch: function () {
    // 小程序启动时执行
    this.initLastUpdateTime()
    this.startUpdateReminder()
    this.initHealthProfile()
  },

  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:3000', // 后端服务器地址
    lastUpdateTime: null,
    updateInterval: 60 * 60 * 1000, // 1小时的毫秒数
    healthProfile: {
      gender: null,  // 性别 'male' 或 'female'
      age: null,     // 年龄
      height: null,  // 身高(cm)
      weight: null,  // 体重(kg)
      activityLevel: null, // 活动水平 1-轻度活动 2-中度活动 3-重度活动
      bmr: null,     // 基础代谢率
      tdee: null     // 每日总能量消耗
    },
    dailyStats: {
      steps: 0,
      calories: 0,
      distance: 0,
      activeMinutes: 0  // 活动时长（分钟）
    }
  },

  // 初始化最后更新时间
  initLastUpdateTime() {
    try {
      const lastUpdateTime = wx.getStorageSync('lastUpdateTime')
      this.globalData.lastUpdateTime = lastUpdateTime || new Date().getTime()
    } catch (error) {
      console.error('初始化更新时间失败:', error)
      this.globalData.lastUpdateTime = new Date().getTime()
    }
  },

  // 启动定时提醒
  startUpdateReminder() {
    // 每隔一小时检查是否需要更新
    setInterval(() => {
      this.checkNeedUpdate()
    }, this.globalData.updateInterval)
  },

  // 检查是否需要更新
  checkNeedUpdate() {
    try {
      const now = new Date().getTime()
      const lastUpdate = this.globalData.lastUpdateTime
      
      if (now - lastUpdate >= this.globalData.updateInterval) {
        wx.showModal({
          title: '温馨提示',
          content: '建议更新您的身体数据以保持数据精准度',
          confirmText: '去更新',
          cancelText: '稍后提醒',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/profile/edit'
              })
            }
          }
        })
      }
    } catch (error) {
      console.error('检查更新失败:', error)
    }
  },

  // 更新身体信息
  updateBodyInfo(hasChanges = true) {
    try {
      const now = new Date().getTime()
      this.globalData.lastUpdateTime = now
      wx.setStorageSync('lastUpdateTime', now)
      
      return {
        updateTime: now,
        status: this.checkHealthStatus(now)
      }
    } catch (error) {
      console.error('更新身体信息失败:', error)
      return {
        updateTime: new Date().getTime(),
        status: '更新失败'
      }
    }
  },

  // 检查健康状态
  checkHealthStatus(updateTime) {
    try {
      const now = new Date().getTime()
      const diff = now - updateTime
      return diff <= this.globalData.updateInterval ? '数据精准' : '建议更新'
    } catch (error) {
      console.error('检查健康状态失败:', error)
      return '状态未知'
    }
  },

  // 计算BMR（基础代谢率）- 使用修订版Harris-Benedict公式
  calculateBMR(profile) {
    const { gender, age, height, weight } = profile
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
  },

  // 计算TDEE（每日总能量消耗）
  calculateTDEE(bmr, activityLevel) {
    const activityFactors = {
      1: 1.2,   // 轻度活动
      2: 1.375, // 中度活动
      3: 1.55   // 重度活动
    }
    return bmr * activityFactors[activityLevel]
  },

  // 获取设备健康数据
  async getDeviceHealthData() {
    try {
      // 获取微信运动数据
      const werunData = await this.getWeRunData()
      
      // 获取其他平台数据（如果有）
      const otherPlatformData = await this.getOtherPlatformData()

      // 合并数据
      const healthData = {
        steps: werunData.step,
        calories: werunData.calories,
        distance: werunData.distance,
        activeMinutes: werunData.activeMinutes
      }

      this.globalData.dailyStats = healthData
      return healthData
    } catch (error) {
      console.error('获取健康数据失败:', error)
      throw error
    }
  },

  // 获取微信运动数据
  getWeRunData() {
    return new Promise((resolve, reject) => {
      wx.getWeRunData({
        success: (res) => {
          // 这里需要发送加密数据到后端解密
          // 目前返回模拟数据
          resolve({
            step: 8000,
            calories: 350,
            distance: 5.6,
            activeMinutes: 45,
            activeCalories: 150  // 添加运动消耗卡路里
          })
        },
        fail: reject
      })
    })
  },

  // 获取其他平台数据（如 Google Fit 或 Apple Health）
  getOtherPlatformData() {
    return new Promise((resolve) => {
      // 这里需要根据不同平台调用不同的API
      // 目前返回空数据
      resolve({
        steps: 0,
        calories: 0,
        distance: 0,
        activeMinutes: 0
      })
    })
  },

  // 初始化健康档案
  initHealthProfile() {
    try {
      // 尝试从本地存储获取健康档案
      const storedProfile = wx.getStorageSync('healthProfile')
      if (storedProfile) {
        this.globalData.healthProfile = storedProfile
      } else {
        // 如果没有存储的档案，设置默认值
        this.globalData.healthProfile = {
          gender: null,
          age: null,
          height: null,
          weight: null,
          activityLevel: 0,
          bmr: null,
          tdee: null,
          birthday: '2000-01-01'
        }
      }
    } catch (error) {
      console.error('初始化健康档案失败:', error)
    }
  },

  // 获取用户完整档案
  getUserFullProfile(userId) {
    try {
      // 获取用户基本信息
      const userInfo = wx.getStorageSync('userInfo')
      // 获取健康档案
      const healthProfile = wx.getStorageSync('healthProfile')
      // 获取最新的减重目标
      const weightGoal = this.getLatestWeightGoal()
      // 获取每日统计
      const dailyStats = this.globalData.dailyStats

      return {
        userInfo,
        healthProfile,
        weightGoal,
        dailyStats,
        lastUpdateTime: this.globalData.lastUpdateTime
      }
    } catch (error) {
      console.error('获取用户档案失败:', error)
      return null
    }
  },

  // 保存完整的用户档案
  saveUserFullProfile(profile) {
    try {
      const { userInfo, healthProfile, weightGoal } = profile
      
      // 保存用户信息
      wx.setStorageSync('userInfo', userInfo)
      // 保存健康档案
      this.saveHealthProfile(healthProfile)
      // 保存减重目标
      if (weightGoal) {
        this.saveWeightGoal(weightGoal)
      }
      
      return true
    } catch (error) {
      console.error('保存用户档案失败:', error)
      return false
    }
  },

  // 保存健康档案
  saveHealthProfile(profile) {
    try {
      // 更新全局数据
      this.globalData.healthProfile = profile
      // 保存到本地存储
      wx.setStorageSync('healthProfile', profile)
      // 更新最后更新时间
      this.updateBodyInfo(true)
      return true
    } catch (error) {
      console.error('保存健康档案失败:', error)
      return false
    }
  },

  // 获取健康档案
  getHealthProfile() {
    try {
      // 优先从本地存储获取
      const storedProfile = wx.getStorageSync('healthProfile')
      if (storedProfile) {
        this.globalData.healthProfile = storedProfile
        return storedProfile
      }
      return this.globalData.healthProfile
    } catch (error) {
      console.error('获取健康档案失败:', error)
      return this.globalData.healthProfile
    }
  },

  // 保存减重目标
  saveWeightGoal(goal) {
    try {
      // 保存到本地存储
      wx.setStorageSync('weightGoal', goal)
      return true
    } catch (error) {
      console.error('保存减重目标失败:', error)
      return false
    }
  },

  // 获取最新的减重目标
  getLatestWeightGoal() {
    try {
      return wx.getStorageSync('weightGoal')
    } catch (error) {
      console.error('获取减重目标失败:', error)
      return null
    }
  }
}) 