// plugin/pages/summary-page.js
Page({
  data: {},
  onLoad() {
    wx.setStorage({
      key: "key",
      data: "value"
    });
    var value = wx.getStorageSync('key')
    console.log(value);
    const res = wx.getStorageInfoSync()
    console.log(res.keys)
    console.log(res.currentSize)
    console.log(res.limitSize)
  }
})
