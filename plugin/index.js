module.exports = {
  sayHello() {
    console.log('Hello plugin!')
  },
  defaultRootUri: '',
  secretKey: '',
  sameFlagCallMinimumInterval: 15,
  userInfo: {
    "ffUserName": "",
    "ffUserEmail": "",
    "ffUserKeyId": "",
    "ffUserCustomizedProperties": [
    ]
  },
  init(
    userInfo = {},
    secretKey = '',
    defaultRootUri = 'https://ffc-api-ce2-dev.chinacloudsites.cn',
    sameFlagCallMinimumInterval = 15) {
    console.log(secretKey);
    this.secretKey = secretKey;
    this.userInfo = userInfo;
    this.defaultRootUri = defaultRootUri;
    this.sameFlagCallMinimumInterval = sameFlagCallMinimumInterval;
  },
  updateFFUserName(ffUserName) {
    this.userInfo.ffUserName = ffUserName;
  },
  updateFFUserEmail(ffUserEmail) {
    this.userInfo.ffUserEmail = ffUserEmail;
  },
  updateFFUserKeyId(ffUserKeyId) {
    this.userInfo.ffUserKeyId = ffUserKeyId;
  },
  updateFFCustomizedProperties(customizedProperties) {
    this.userInfo.customizedProperties = customizedProperties;
  },
  checkFromStorage(storageKey) {
    let lastFFVariationStr = wx.getStorageSync(storageKey);
    let lastFFVariation = null;
    if (lastFFVariationStr && lastFFVariationStr !== null) {
      lastFFVariation = JSON.parse(lastFFVariationStr);
    }
    return lastFFVariation;
  },
  actionWhenError(action, lastFFVariation, returnValueWhenUnhandledException) {
    if (lastFFVariation == null) {
      action(returnValueWhenUnhandledException);
    }
    else {
      action(lastFFVariation.variationValue);
    }
  },
  checkVariation(
    featureFlagKeyName,
    action,
    returnValueWhenUnhandledException = { localId: -1, variationValue: 'error' }) {
    let body = this.userInfo;
    body.environmentSecret = this.secretKey;
    body.featureFlagKeyName = featureFlagKeyName;

    let storageKey = body.featureFlagKeyName + body.ffUserKeyId;
    let lastFFVariation = this.checkFromStorage(storageKey);

    let nowTimeStamp = Math.round(new Date().getTime() / 1000);
    if (lastFFVariation !== null &&
      ((lastFFVariation.timeStamp + this.sameFlagCallMinimumInterval) >= nowTimeStamp)) {
      action(lastFFVariation.variationValue);
    }
    else {
      let actionWhenError = this.actionWhenError;
      wx.request({
        url: this.defaultRootUri + '/Variation/GetMultiOptionVariation',
        data: body,
        header: { 'Content-Type': 'application/json' },
        method: 'POST',
        fail: function (res) {
          actionWhenError(action, lastFFVariation, returnValueWhenUnhandledException);
        },
        success: function (res) {
          if (res.statusCode === 200) {
            wx.setStorage({
              key: storageKey,
              data: JSON.stringify({
                variationValue: res.data,
                timeStamp: nowTimeStamp
              })
            });
            action(res.data);
          }
          else {
            actionWhenError(action, lastFFVariation, returnValueWhenUnhandledException);
          }
        }
      });
    }
  },
  checkVariationAsync(
    featureFlagKeyName,
    returnValueWhenUnhandledException = { localId: -1, variationValue: 'error' }) {
    let body = this.userInfo;
    body.environmentSecret = this.secretKey;
    body.featureFlagKeyName = featureFlagKeyName;

    let storageKey = body.featureFlagKeyName + body.ffUserKeyId;
    let lastFFVariation = this.checkFromStorage(storageKey);

    let nowTimeStamp = Math.round(new Date().getTime() / 1000);
    if (lastFFVariation !== null &&
      ((lastFFVariation.timeStamp + this.sameFlagCallMinimumInterval) >= nowTimeStamp))
      return lastFFVariation.variationValue;

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.defaultRootUri + '/Variation/GetMultiOptionVariation',
        data: body,
        header: { 'Content-Type': 'application/json' },
        method: 'POST',
        fail: function (res) {
          if (lastFFVariation == null) {
            resolve(returnValueWhenUnhandledException);
          }
          else {
            resolve(lastFFVariation.variationValue);
          }
        },
        success: function (res) {
          wx.setStorage({
            key: storageKey,
            data: JSON.stringify({
              variationValue: res.data,
              timeStamp: nowTimeStamp
            })
          });
          resolve(res.data);
        }
      });
    });
  }
}
