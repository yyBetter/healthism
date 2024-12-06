Component({
  methods: {
    handleTriggerUpdate() {
      const app = getApp()
      app.checkNeedUpdate()
    }
  }
}) 