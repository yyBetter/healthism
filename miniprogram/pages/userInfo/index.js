Page({
  data: {
    lastUpdateTime: 0,
    healthStatus: ''
  },

  onLoad() {
    console.log('页面加载')
    this.updateData()
  },

  onShow() {
    console.log('页面显示')
    this.updateData()
  },

  updateData() {
    const app = getApp()
    console.log('当前时间:', app.globalData.lastUpdateTime)
    
    this.setData({
      lastUpdateTime: app.globalData.lastUpdateTime,
      healthStatus: app.checkHealthStatus(app.globalData.lastUpdateTime)
    }, () => {
      console.log('数据更新完成:', this.data)
    })
  }
}) 