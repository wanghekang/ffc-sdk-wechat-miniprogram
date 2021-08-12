// app.js
const FEATURE_FLAGS = require('/utils/featureFlags.js')

App({
  onLaunch() {
    FEATURE_FLAGS.init();
  }
})
