const FEATURE_FLAGS = require('../../utils/featureFlags.js')
const MOCK_USER_DATA = require('../../utils/mockUserData.js')

// pages/login/index.js
Page({

  data: {
    email: '',
    username: '',
    group: 'RD'
  },
  onShow(){
    console.log('onShow')
  },

  onLoad: function (options) {
    this.setData(MOCK_USER_DATA.generateUserData('RD'))
  },

  formSubmit(e) {
    FEATURE_FLAGS.setUserInfo({
      "ffUserName": e.detail.value.username,
      "ffUserEmail": e.detail.value.email,
      "ffUserKeyId": `${e.detail.value.username}`,
      "ffUserCustomizedProperties": [
        {
          name: "group",
          value: `${e.detail.value.group}`
        },
        {
          name: "sexe",
          value: `男`
        }
      ]
    });

    wx.redirectTo({
      url: '../index/index'
    })
  },

  groupChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    switch (e.detail.value) {
      case 'RD':
        this.setData(MOCK_USER_DATA.generateUserData('RD'))
        break;
      case 'PM':
        this.setData(MOCK_USER_DATA.generateUserData('PM'))
        break;
      case 'BD':
        this.setData(MOCK_USER_DATA.generateUserData('BD'))
        break;
      case 'User':
        this.setData(MOCK_USER_DATA.generateUserData('User'))
        break;
    }

  }
})