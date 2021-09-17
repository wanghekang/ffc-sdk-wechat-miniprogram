// app.js
const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
App({
  onLaunch() {
    FFC.init(
      null,
      "MDMyLTQ5ZDAtNCUyMDIxMDgxMDEwMzQwMl9fMl9fMjJfXzYwX19kZWZhdWx0X2QzMzNh",
      20,
      "Production"
    );
  }
})
