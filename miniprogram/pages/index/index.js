const FEATURE_FLAGS = require('../../utils/featureFlags.js')

Page({
  data: {
    items: [],
    currentItem: 0,
    variation: "",
    pluginAllowed: false,
    showFFCAdminPanel: false
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
          name: "sourceStr",
          value: `wechat`
        }
      ]
    });
    FEATURE_FLAGS.adminPanel([
      {
        variationValue: 'Blue',
        action: () => {
          this.setData({
            showFFCAdminPanel: true
          })
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
