//const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
const FFC = require('../ffcplugin/index')

function envKey(){
	return "YzBiLTZhZGEtNCUyMDIxMDkwNTAyNDM0Ml9fMl9fM19fMTA0X19kZWZhdWx0XzczOWY4";
}
function defaultRootUri(){
	return FFC.defaultRootUri;
}


function setUserInfo(wechatUserInfo) {
	FFC.initFFUserInfo(wechatUserInfo);
}

function showNewFunction(actions) {
	FFC.checkVariation(
		'开关flag名字',
		e => {
			functions[e.variationValue].Execute();
		});
}

module.exports = {
	init: init,
	showNewFunction: showNewFunction,
	setUserInfo: setUserInfo,
	envKey: envKey,
	defaultRootUri: defaultRootUri
}
