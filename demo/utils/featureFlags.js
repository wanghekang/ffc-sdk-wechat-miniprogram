//const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
const FFC = require('../ffcplugin/index')

function init() {
	FFC.init(
		null,
		// "ZGMxLTQ2NWUtNCUyMDIxMDgxMTE1NDAzNF9fMl9fMl9fNF9fZGVmYXVsdF85YWZlYQ==",
		"MWEwLWIwODEtNCUyMDIxMDkwMTEzMDEzNl9fMl9fMjJfXzQ0X19kZWZhdWx0XzQ4ZTRh",
		1,
		"Production"
	);
}

function setUserInfo(wechatUserInfo) {
	FFC.initFFUserInfo(wechatUserInfo);
}

function showNewFunction(actions) {
	FFC.checkVariation(
		'测试',
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
}
