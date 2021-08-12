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
  featureFlags: [],
  storageKey: 'ffc-sdk-wechat-miniprogram',
  init(
    userInfo = null,
    secretKey = '',
    sameFlagCallMinimumInterval = 15,
    env = 'Production') {
    console.log(secretKey);
    this.secretKey = secretKey;
    if (userInfo && userInfo !== null)
      this.userInfo = userInfo;
    if (env === 'Production')
      this.defaultRootUri = 'https://api.feature-flags.co';
    else
      this.defaultRootUri = 'https://ffc-api-ce2-dev.chinacloudsites.cn';
    this.sameFlagCallMinimumInterval = sameFlagCallMinimumInterval;
    this.featureFlags = this.getStorage();
  },
  initFFUserInfo(userInfo) {
    this.userInfo = userInfo;
  },
  updateFFUserKeyId(ffUserKeyId) {
    this.userInfo.ffUserKeyId = ffUserKeyId;
  },
  updateFFUserName(ffUserName) {
    this.userInfo.ffUserName = ffUserName;
  },
  updateFFUserEmail(ffUserEmail) {
    this.userInfo.ffUserEmail = ffUserEmail;
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
      action(lastFFVariation.data.variationValue);
    }
  },
  getStorage() {
    let featureFlags = wx.getStorageSync(this.storageKey);
    if (!featureFlags || featureFlags === null || featureFlags.length === 0) {
      wx.setStorage({
        key: this.storageKey,
        data: JSON.stringify([])
      });
      featureFlags = wx.getStorageSync(this.storageKey);
    }
    return JSON.parse(featureFlags);
  },
  updateFeatureFlags(key, variationValue, featureFlags, storageKey) {
    let ff = featureFlags.find(p => p.key == key);
    let data = {
      variationValue,
      timeStamp: Math.round(new Date().getTime() / 1000)
    };
    if (ff)
      ff.data = data
    else {
      featureFlags.push({
        key,
        data
      })
    }
    wx.setStorage({
      key: storageKey,
      data: JSON.stringify(featureFlags)
    });
  },
  checkVariation(
    featureFlagKeyName,
    action,
    returnValueWhenUnhandledException = { localId: -1, variationValue: 'error' }) {
    let body = {
      ffUserName: this.userInfo.ffUserName,
      ffUserEmail: this.userInfo.ffUserEmail,
      ffUserKeyId: this.userInfo.ffUserKeyId,
      ffUserCustomizedProperties: this.userInfo.ffUserCustomizedProperties,
      environmentSecret: this.secretKey,
      featureFlagKeyName: featureFlagKeyName
    };

    let key = body.featureFlagKeyName + '@@' + body.ffUserKeyId;
    let lastFFVariation = this.featureFlags.find(p => p.key == key);
    let nowTimeStamp = Math.round(new Date().getTime() / 1000);
    if (lastFFVariation && lastFFVariation !== null &&
      (this.sameFlagCallMinimumInterval >= (nowTimeStamp - lastFFVariation.data.timeStamp) &&
        lastFFVariation.data.timeStamp < nowTimeStamp)) {
      action(lastFFVariation.data.variationValue);
    }
    else {
      let actionWhenError = this.actionWhenError;
      let updateFeatureFlags = this.updateFeatureFlags;
      let featureFlags = this.featureFlags;
      let storageKey = this.storageKey;
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
            updateFeatureFlags(key, res.data, featureFlags, storageKey);
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
    let body = {
      ffUserName: this.userInfo.ffUserName,
      ffUserEmail: this.userInfo.ffUserEmail,
      ffUserKeyId: this.userInfo.ffUserKeyId,
      ffUserCustomizedProperties: this.userInfo.ffUserCustomizedProperties,
      environmentSecret: this.secretKey,
      featureFlagKeyName: featureFlagKeyName
    };

    let key = body.featureFlagKeyName + '@@' + body.ffUserKeyId;
    let lastFFVariation = this.featureFlags.find(p => p.key == key);
    let nowTimeStamp = Math.round(new Date().getTime() / 1000);

    if (lastFFVariation && lastFFVariation !== null &&
      (this.sameFlagCallMinimumInterval >= (nowTimeStamp - lastFFVariation.data.timeStamp) &&
        lastFFVariation.data.timeStamp < nowTimeStamp)) {
      return lastFFVariation.data.variationValue;
    }

    return new Promise((resolve, reject) => {
      let updateFeatureFlags = this.updateFeatureFlags;
      let featureFlags = this.featureFlags;
      let storageKey = this.storageKey;
      wx.request({
        url: this.defaultRootUri + '/Variation/GetMultiOptionVariation',
        data: body,
        header: { 'Content-Type': 'application/json' },
        method: 'POST',
        fail: function (res) {
          resolve(
            (!lastFFVariation || lastFFVariation === null) ?
              returnValueWhenUnhandledException
              :
              lastFFVariation.data.variationValue);
        },
        success: function (res) {
          if (res.statusCode === 200) {
            updateFeatureFlags(key, res.data, featureFlags, storageKey);
            resolve(res.data);
          }
          else {
            resolve(
              (!lastFFVariation || lastFFVariation === null) ?
                returnValueWhenUnhandledException
                :
                lastFFVariation.data.variationValue);
          }
        }
      });
    });
  }
}
