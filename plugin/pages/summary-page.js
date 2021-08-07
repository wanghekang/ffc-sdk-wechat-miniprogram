// plugin/pages/summary-page.js
Page({
  data: {
    items: []
  },
  storageKey: 'ffc-sdk-wechat-miniprogram',
  onLoad() {
    let featureFlagsStr = wx.getStorageSync(this.storageKey);
    if (featureFlagsStr && featureFlagsStr !== null && featureFlagsStr.length > 0) {
      let featureFlags = JSON.parse(featureFlagsStr);
      items = featureFlags;
    }
  }
})
