// app.js
const FFC = require('./ffcplugin/index')

App({
  onLaunch() {
    // 初始化FFC连接
    FFC.init(
      // environment key
      "YThmLWRmZjUtNCUyMDIxMDkxNzA3NTYyMV9fMl9fMjJfXzExNl9fZGVmYXVsdF82NTM3Mg==",
      // 相同feature flag的重复调用最短间隔(秒)，在最短间隔内，sdk将使用上次调用结果返回
      10
    );

    // 初始化用户信息，通常这一步会在登录后被调用
    FFC.initFFUserInfo({
      "ffUserName": "sdk-sample-miniprogram",
      "ffUserEmail": "",
      "ffUserKeyId": "sdk-sample-miniprogram", // 项目环境内用户唯一Id
      "ffUserCustomizedProperties": [  // 用户自定义属性
        {
          name: "外放地址",
          value: "?from=zhihu&group=pm"
        }
      ]
    });
  }
})
