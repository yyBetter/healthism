Component({
  properties: {
    date: {
      type: String,
      value: ''
    }
  },

  data: {
    isToday: false,
    formatDate: ''
  },

  lifetimes: {
    attached() {
      this.initDate()
    }
  },

  methods: {
    initDate() {
      const date = this.properties.date ? new Date(this.properties.date) : new Date()
      this.checkIsToday(date)
      this.formatDisplayDate(date)
    },

    checkIsToday(date) {
      const today = new Date()
      this.setData({
        isToday: this.isSameDay(today, date)
      })
    },

    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate()
    },

    formatDisplayDate(date) {
      const formatDate = `${date.getMonth() + 1}月${date.getDate()}日`
      this.setData({ formatDate })
    },

    prevDay() {
      const date = this.properties.date ? new Date(this.properties.date) : new Date()
      date.setDate(date.getDate() - 1)
      this.checkIsToday(date)
      this.formatDisplayDate(date)
      this.triggerEvent('change', { date })
    },

    nextDay() {
      if (this.data.isToday) return
      const date = this.properties.date ? new Date(this.properties.date) : new Date()
      date.setDate(date.getDate() + 1)
      this.checkIsToday(date)
      this.formatDisplayDate(date)
      this.triggerEvent('change', { date })
    }
  }
}) 