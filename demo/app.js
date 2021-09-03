// app.js
const FEATURE_FLAGS = require('/utils/featureFlags.js')
const FFC = require('./ffcplugin/index')


App({
  onLaunch() {
    FEATURE_FLAGS.init();
    console.log(this)
    // FFC.experimentsPage();
    // FFC.experimentsNavigateTo();
  }
})
