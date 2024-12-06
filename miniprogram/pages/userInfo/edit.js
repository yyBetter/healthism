Page({
  // ... 其他代码 ...

  handleUpdate(e) {
    const hasChanges = e.currentTarget.dataset.hasChanges
    const app = getApp()
    const result = app.updateBodyInfo(hasChanges)
    
    wx.showToast({
      title: '更新成功',
      icon: 'success'
    })

    // 返回上一页并刷新数据
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage) {
      prevPage.setData({
        lastUpdateTime: result.updateTime,
        healthStatus: result.status
      })
    }
    
    wx.navigateBack()
  }
}) 