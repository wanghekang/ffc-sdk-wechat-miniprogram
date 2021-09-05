//const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
const FFC = require('../ffcplugin/index')

function envKey(){
	return "YzBiLTZhZGEtNCUyMDIxMDkwNTAyNDM0Ml9fMl9fM19fMTA0X19kZWZhdWx0XzczOWY4";
}
function defaultRootUri(){
	return FFC.defaultRootUri;
}

function init() {
	FFC.init(
		null,
		envKey(),
		1,
		"Production"
	);
}

function setUserInfo(wechatUserInfo) {
	FFC.initFFUserInfo(wechatUserInfo);
}

function showNewFunction(actions) {
	FFC.checkVariation(
		'微信小程序测试',
		e => {
			console.log(e);
			switch (e.variationValue) {
				case 'true - real data':
					let action = actions.find(p => p.variationValue == 'true - real data');
					action.action();
					break;
				case 'true - demo data':
					action = actions.find(p => p.variationValue == 'true - demo data');
					action.action();
					break;
				default:
					break;
			}
		});
}

module.exports = {
	init: init,
	showNewFunction: showNewFunction,
	setUserInfo: setUserInfo,
	envKey: envKey,
	defaultRootUri: defaultRootUri
}
