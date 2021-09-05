// app.js
const FEATURE_FLAGS = require('/utils/featureFlags.js')
const FFC = require('./ffcplugin/index')

// const ffcMonitorWorker = wx.createWorker('ffcplugin/workers/sendToServer.js') 

App({
  onLaunch() {
    FEATURE_FLAGS.init();
    // this.timer = setInterval(()=>{
    //   // ffcMonitorWorker.postMessage({
    //   //   msg: 'hello worker'
    //   // })
    // }, 1500)
  }
})
