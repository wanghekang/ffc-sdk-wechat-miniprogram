const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')

function setUserInfo(wechatUserInfo) {
	FFC.initFFUserInfo(wechatUserInfo);
}

function demoFlag(actions) {
	FFC.checkVariation(
		'basic-simple-flag',
		e => {
			switch (e.variationValue) {
				case 'true':
					let action = actions.find(p => p.variationValue == 'true');
					action.action();
					break;
				case '市场部门':
					action = actions.find(p => p.variationValue == '市场部门');
					action.action();
					break;
				default:
					console.log('default');
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
	demoFlag: demoFlag,
	setUserInfo: setUserInfo,
	testAsync: testAsync,
	test: test
}
