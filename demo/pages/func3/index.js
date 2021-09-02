const FEATURE_FLAGS = require('../../utils/featureFlags.js')

Page({
  data: {
    showNewFunction: false,
    showMockNewFunction: false
  },
  onLoad() {
  },
  newFunction(){
    this.setData({ showNewFunction: true })
  },
  mockNewFunction(){
    this.setData({ showMockNewFunction: true })
  }
})
