# ffc-sdk-wechat-miniprogram

## 推荐版本

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

pages/my/index.js文件中添加

	async getUserApiInfo() {
		const res = await WXAPI.userDetail(wx.getStorageSync('token'))
		let _data = {}
		console.log(res.data);
		FEATURE_FLAGS.setUserInfo(res.data);
		if (res.data.base.nick && res.data.base.avatarUrl) {
			_data.userInfoStatus = 2
		} else {
			_data.userInfoStatus = 1
		}
		this.setData(_data)
	},

### 通过开关连接远程配置，获得该用户对应着开关的返回值，并根据业务逻辑执行不同的功能模块

utils/featureFlags.js文件中添加

	function categoryPage(actions) {
		FFC.checkVariation(
			'ffc-multi-variation-ffp-test-data3-1628224107322',
			e => {
				switch (e.variationValue) {
					case 'Dev':
						wx.setTabBarItem({
							index: 1,
							pagePath: "pages/index/index",
							iconPath: "images/nav/home-off.png",
							selectedIconPath: "images/nav/home-on.png",
							text: "分类(Dev)"
						});
						let action = actions.find(p => p.variationValue == 'Dev');
						console.log(action);
						action.action();
						break;
					default:
						(actions.find(p => p.variationValue == 'Default')).action();
						break;
				}
			});
	}

pages/category/index.js文件中代码

	onLoad: function () {
		FEATURE_FLAGS.categoryPage([
			{
				variationValue: 'Dev',
				action: this.onLoadForDev
			},
			{
				variationValue: 'Demo',
				action: this.onLoadForDemo
			},
			{
				variationValue: 'Prod',
				action: this.onLoadForProd
			},
			{
				variationValue: 'Default',
				action: this.onLoadForDefault
			}
		]);
	},

## 设置当对相同开关进行高频连续判断时，向远程调用的频率

在app.js文件中

	onLaunch: function () {
		FFC.init(
			null, // 这里同样可以初始化用户信息
			"MzkwLFFWZlYjctNCUyMDIxMD8zzQW6e2EV9fNF9fMl9fNF9fZGVmYXVsdF9hNGIyYQ==",  // 敏捷开关内对应项目->环境的secret key
			15  // 设置当对相同开关进行高频连续判断时，向远程调用的频率, 默认 sameFlagCallMinimumInterval = 15秒
		);
	}

## 在小程序中查看敏捷开关使用概述

utils/featureFlags.js文件中添加

	function adminPanel(actions) {
		FFC.checkVariation(
			'ffc-multi-variation-ffp-test-data3-1628224107322',
			e => {
				switch (e.variationValue) {
					case 'Admin':
						let action = actions.find(p => p.variationValue == 'Admin');
						action.action();
						break;
					default:
						(actions.find(p => p.variationValue == 'Default')).action();
						break;
				}
			});
	}

在pages/my/index.js文件中

	onLoad: function () {
		FEATURE_FLAGS.adminPanel([
			{
				variationValue: 'Admin',
				action: () => {
					this.setData({
						showFFCAdminPanel: true
					})
				}
			}
		]);
	},

在pages/my/index.wxml文件中

	<view class="cu-bar" hidden="{{!showFFCAdminPanel}}">
		<view class="action">
			<navigator url="plugin://ffc-sdk-wechat-miniprogram/summary-page">
				<button>查看敏捷开关使用概述</button>
			</navigator>
		</view>
	</view>

## 同步或异步调用Variation判断函数

案例代码:

	// 同步
	async function testAsync() {
		let result = await FFC.checkVariationAsync('ffc-multi-variation-ffp-test-data3-1628224107322');
		return result;
	}
	if((await FEATURE_FLAGS.testAsync()).variationValue == 'Green'){
		wx.showToast({
			title: 'Green',
		})
	}

	// 异步
	function test(action) {
		FFC.checkVariation(
			'ffc-multi-variation-ffp-test-data3-1628224107322',
			e => {
				action(e);
			});
	}
	FEATURE_FLAGS.test((e) => {
			wx.showToast({
			title: e.variationValue,
		})
	});
