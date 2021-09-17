# ffc-sdk-wechat-miniprogram

## 安装

推荐使用文件夹"version2.0"中的ffcplugin源码，作为微信小程序的SDK使用。只需像"version2.0"项目中一样调用相关SDK功能即可。

## Demo

使用微信小程序开发工具，打开文件夹"version2.0"中的项目，即可看到示例效果

![image](https://user-images.githubusercontent.com/68597908/133771373-a8796355-4b39-4ad8-85c4-2b6011bcfa4c.png)

## 集成SDK到自己的小程序

### 在小程序根部的app.js中初始化敏捷开关

在app.js文件中添加
```javascript
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
```
### 在用户登录后传递用户信息给敏捷开关SDK
```javascript
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
```
### 从敏捷开关服务器获取分配给用户的变量值，并根据业务逻辑执行不同的功能模块
```javascript
  FFC.checkVariation(
    '主页---话术版本',
    e => {
      let versions = [false, false, false];
      let variations = ['产品经理版1', '程序员版1', '产品经理版2'];
      versions[variations.indexOf(e.variationValue)] = true;
      this.setData({
        showVersion: versions 
      })
   });
```

如果需要异步请求的函数，可以在源码"/ffcplugin/index.js"文件中寻找"checkVariationAsync"函数
### 捕捉点击按钮的事件(custom event)
```javascript
  FFC.track(
    '开始使用点击事件',
    [],
    () => {
      wx.showModal({
        title: '谢谢使用'
      })
    },
    () => {
      wx.showModal({
        title: '错误异常'
      })
    })
```
