const WXAPI = require('apifm-wxapi')
const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')

function categoryPage(actions) {
	FFC.checkVariation(
		'ffc-multi-variation-ffp-test-data3-1628224107322',
		e => {
			switch (e.variationValue) {
				case 'Green':
					wx.setTabBarItem({
						index: 1,
						pagePath: "pages/index/index",
						iconPath: "images/nav/home-off.png",
						selectedIconPath: "images/nav/home-on.png",
						text: "分类(Dev)"
					});
					let action = actions.find(p=>p.variationValue == 'Green');
					console.log(action);
					action.action();
					break;
			}
		});
}

module.exports = {
	categoryPage: categoryPage
}
