const FEATURE_FLAGS = require('../../utils/featureFlags.js')

Page({
  data: {
    items: [],
    currentItem: 0,
    variation: "",
    pluginAllowed: false,
    showFFCAdminPanel: false
  },
  gongNengMoKuai1(){

  },
  onLoad() {
   
    FEATURE_FLAGS.setUserInfo({
      "ffUserName": "hu-beau@outlook.com",
      "ffUserEmail": "hu-beau@outlook.com",
      "ffUserKeyId": "hu-beau@outlook.com",
      "ffUserCustomizedProperties": [
        {
          name: "gender",
          value: `male`
        },
        {
          name: "Role",
          value: `开发者`
        }
      ] 
    });
    FEATURE_FLAGS.demoFlag([
      {
        variationValue: '市场部门',
        action: () => {
          this.setData({
            showFFCAdminPanel: true
          })
          this.gongNengMoKuai1();
        }
      },
      {
        variationValue: 'Default',
        action: () => { }
      }
    ]);

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
