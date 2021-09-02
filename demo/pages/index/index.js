const FEATURE_FLAGS = require('../../utils/featureFlags.js')

Page({
  data: {
    showNewFunction: false,
    showMockNewFunction: false
  },
  onLoad() {
    FEATURE_FLAGS.showNewFunction([
      {
        variationValue: 'true - real data',
        action: () => {
          this.newFunction()
        }
      },
      {
        variationValue: 'true - demo data',
        action: () => {
          this.mockNewFunction()
        }
      }
    ]);
  },
  newFunction(){
    this.setData({ showNewFunction: true })
  },
  mockNewFunction(){
    this.setData({ showMockNewFunction: true })
  },
  func2(){
    wx.navigateTo({
      url: '../func3/index',
    })
  }
})
