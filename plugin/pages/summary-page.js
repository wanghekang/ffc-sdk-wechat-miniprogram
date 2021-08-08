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
      if (featureFlags && featureFlags !== null && featureFlags.length > 0) {
        featureFlags.sort((a, b) => {
          return a.data.timeStamp == b.data.timeStamp ? 0 : a.data.timeStamp > b.data.timeStamp ? -1 : 1;
        });
        featureFlags.forEach(item => {
          item.featureFlagName = item.key.split("@@")[0];
          item.userKeyId = item.key.split("@@")[1];
          item.data.timeStamp = (new Date(item.data.timeStamp * 1000)).toLocaleString();
        })
        this.setData({
          items: featureFlags
        })
      }
    }
  }
})
