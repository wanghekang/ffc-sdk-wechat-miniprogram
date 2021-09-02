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
      // this.defaultRootUri = 'https://api.feature-flags.co';
      this.defaultRootUri = 'https://ffc-api-ce2-dev.chinacloudsites.cn';
    else
      // this.defaultRootUri = 'https://ffc-api-ce2-dev.chinacloudsites.cn';
      this.defaultRootUri = 'http://localhost:5001';
    this.sameFlagCallMinimumInterval = sameFlagCallMinimumInterval;
    this.featureFlags = this.getStorage();


    this.experimentsPage();
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
  },


  experimentsPage() {
    // 重写page函数，增加阿里云监控和日志记录
    wx.setStorage({
      key: "ffc-sdk-wechat-miniprogram-pageview",
      data: JSON.stringify([])
    });
    let oldPage = Page
    Page = function (obj) {
      // 重写onShow方法，用一个变量保存旧的onShow函数
      let oldOnShow = obj.onShow
      obj.onShow = function () {
        console.log(this)
        let route = this.route;
        wx.nextTick(() => {
          console.log("nextTick");
          let storageKey = "ffc-sdk-wechat-miniprogram-pageview";
          let pageViewsStr = wx.getStorageSync(storageKey);
          let pageViews = JSON.parse(pageViewsStr);
          pageViews.push({
            route: route,
            timeStamp: Math.round(new Date().getTime() / 1000),
            type: 'pageview'
          })
          wx.setStorage({
            key: storageKey,
            data: JSON.stringify(pageViews)
          });
        })
        console.log(obj)

        // 此处不能写成oldOnShow()，否则没有this，this.setData等方法为undefined。这里的this在Page构造函数实例化的时候才会指定
        // 在Page构造函数实例化的时候，小程序会将当前的Page对象的原型链（__proto__）增加很多方法，例如setData。当前的obj没有setData
        // 上面一段是我猜的
        // oldOnShow.call(this)
      }
      // 重写onHide方法，用一个变量保存旧的onHide函数
      let oldOnHide = obj.onHide
      obj.onHide = function () {
        console.log("leavePageLog")

        // 此处不能写成oldOnHide()，否则没有this，this.setData等方法为undefined。这里的this在Page对象实例化的时候才会指定
        // oldOnHide.call(this)
      }
      return oldPage(obj)
    }
  }
}