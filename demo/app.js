// app.js
const FFC = requirePlugin('ffc-sdk-wechat-miniprogram')
App({
  onLaunch() {
    FFC.init(
      null,
      "YWM5LTJlZDUtNCUyMDIxMDgxMDEyNTEwOV9fMl9fMjJfXzY0X19kZWZhdWx0Xzg4NTdj",
      20,
      "Production"
    );
  }
})
