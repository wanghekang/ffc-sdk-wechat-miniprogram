const FFC = require('../../ffcplugin/index')

Page({
  data: {
    versionText: 'ad',
    showVersion: [false, false, false]
  },
  onLoad() {
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
  },
})
