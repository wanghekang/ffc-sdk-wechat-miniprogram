# ffc-sdk-wechat-miniprogram

敏捷开关(feature-flags.co) 为小程序开发者方便实用feature flags服务提供的SDK

主要功能包括：

1. 调用敏捷开关远程服务，根据自定义的用户信息与开关设置，获得对应的Flag返回值
2. 设置当对相同开关进行高频连续判断时，向远程调用的频率
3. 当网络故障(如网络状况差、无网络)，且需要获得未调用过的开关时，可以通过设置默认返回值控制程序走向。

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