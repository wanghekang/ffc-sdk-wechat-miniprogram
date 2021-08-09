const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')

function setUserInfo(wechatUserInfo) {
	FFC.initFFUserInfo(wechatUserInfo);
}

function adminPanel(actions) {
	FFC.checkVariation(
		'ffc-multi-variation-ffp-test-data3-1628224107322',
		e => {
			switch (e.variationValue) {
				case 'Blue':
					let action = actions.find(p => p.variationValue == 'Blue');
					action.action();
					break;
				default:
					(actions.find(p => p.variationValue == 'Default')).action();
					break;
			}
		});
}

async function testAsync() {
	let result = await FFC.checkVariationAsync('ffc-multi-variation-ffp-test-data3-1628224107322');
	return result;
}

async function test(action) {
	FFC.checkVariation(
		'ffc-multi-variation-ffp-test-data3-1628224107322',
		e => {
			action(e);
		});
}

module.exports = {
	adminPanel: adminPanel,
	setUserInfo: setUserInfo,
	testAsync: testAsync,
	test: test
}
