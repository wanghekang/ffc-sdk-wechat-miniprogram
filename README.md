# ffc-sdk-wechat-miniprogram

敏捷开关(feature-flags.co) 为小程序开发者方便实用feature flags服务提供的SDK

主要功能包括：

1. 调用敏捷开关远程服务，根据自定义的用户信息与开关设置，获得对应的Flag返回值
2. 设置当对相同开关进行高频连续判断时，向远程调用的频率
3. 当网络故障(如网络状况差、无网络)，且需要获得未调用过的开关时，可以通过设置默认返回值控制程序走向。
4. 在小程序中查看敏捷开关使用概述
5. 同步或异步调用Variation判断函数

小程序开发者同样可以访问github的开源页面，将源代码植入自己的程序方便自己更个性化的设置。

feature-flags.co项目开源地址为: https://github.com/feature-flags-co
微信小程序SDK开源地址为: https://github.com/feature-flags-co/ffc-sdk-wechat-miniprogram

## 快速案例

如下代码均来自敏捷开关小程序开源地址项目(ffc-sdk-wechat-miniprogram)中的miniprogrem案例

### 在小程序根部的app.js中初始化敏捷开关

在app.js文件中添加

	onLaunch: function () {
		FFC.init(
			null, // 这里同样可以初始化用户信息
			"MzkwLFFWZlYjctNCUyMDIxMD8zzQW6e2EV9fNF9fMl9fNF9fZGVmYXVsdF9hNGIyYQ=="  // 敏捷开关内对应项目->环境的secret key
		);
	}

### 在用户登录后传递用户信息给敏捷开关SDK

utils/featureFlags.js文件中添加

	const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')

	function setUserInfo(wechatUserInfo) {
		FFC.initFFUserInfo({
			ffUserName: wechatUserInfo.base.nick,
			ffUserEmail: "",
			ffUserKeyId: wechatUserInfo.base.id,
			ffUserCustomizedProperties: [
				{
					name: "gender",
					value: `${wechatUserInfo.base.gender}`
				},
				{
					name: "sourceStr",
					value: `${wechatUserInfo.base.sourceStr}`
				}
			]
		});
	}

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