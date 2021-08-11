// app.js
const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
App({
  onLaunch() {
    FFC.init(
      null,
      "ZGMxLTQ2NWUtNCUyMDIxMDgxMTE1NDAzNF9fMl9fMl9fNF9fZGVmYXVsdF85YWZlYQ==",
      5,
      "Production"
    );
  }
})
