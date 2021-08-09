// app.js
const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
App({
  onLaunch() {
    FFC.init(
      null,
      "MzkwLWZlYjctNCUyMDIxMDczMTExNDkwNV9fNF9fMl9fNF9fZGVmYXVsdF9hNGIyYQ==",
      20,
      "Development"
    );

  }
})
