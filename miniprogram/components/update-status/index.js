Component({
  properties: {
    lastUpdateTime: {
      type: Number,
      value: 0
    }
  },

  data: {
    statusText: '',
    timeText: ''
  },

  lifetimes: {
    attached() {
      this.updateDisplay()
    }
  },

  methods: {
    updateDisplay() {
      const app = getApp()
      const status = app.checkHealthStatus(this.properties.lastUpdateTime)
      const date = new Date(this.properties.lastUpdateTime)
      
      this.setData({
        statusText: status,
        timeText: `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
      })
    }
  }
}) 