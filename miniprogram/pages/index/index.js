const FeatureFlagCo = requirePlugin('hello-plugin')
Page({
  data: {
    items: [],
    currentItem: 0,
    variation: "",
    pluginAllowed: false
  },
  onLoad() {
    FeatureFlagCo.sayHello()
    const world = FeatureFlagCo.answer

    FeatureFlagCo.checkVariation(
      'ffc-multi-variation-ffp-test-data3-1628224107322',
      e => {
        switch (e.variationValue) {
          case "Green":
            this.setData({ pluginAllowed: true });
            break;
        }
      });

  },
  async addItemAsync() {
    let checkResult = await FeatureFlagCo.checkVariationAsync('ffc-multi-variation-ffp-test-data3-1628224107322');
    if (checkResult.variationValue === "Green")
      wx.showToast({
        title: checkResult.variationValue,
        icon: 'success',
        duration: 2000
      })
    else
      wx.showToast({
        title: checkResult.variationValue,
        icon: 'failed',
        duration: 2000
      })
  },
  addItem() {
    FeatureFlagCo.checkVariation(
      'ffc-multi-variation-ffp-test-data3-1628224107322',
      e => {
        console.log(e);
        this.setData({
          variation: JSON.stringify(e)
        });
      });
  }
})
