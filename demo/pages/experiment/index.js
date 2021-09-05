const FEATURE_FLAGS = require('../../utils/featureFlags.js')

Page({
  data: {
    items: []
  },
  onLoad() {
    let pageThis = this;
    let start = Math.round(new Date().getTime()) - 1000*60*60;
    let end = Math.round(new Date().getTime())
    console.log(start+' ' + end)
    wx.request({
      url: FEATURE_FLAGS.defaultRootUri() + '/ExperimentsSearch/RawData?secret=' + FEATURE_FLAGS.envKey()+'&startUnixTimeStamp='+start+'&endUnixTimeStamp='+end,
      header: { 'Content-Type': 'application/json' },
      method: 'GET',
      fail: function (res) {
          console.log(res);
          console.log(res);
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // console.log(res.data.es);
          let es = JSON.parse(res.data.es);
          console.log(es);
          if(es && es.hits && es.hits.hits &&es.hits.hits.length > 0){
            let items = []
            es.hits.hits.forEach(element => {
              items.push(element._source)
            });
            pageThis.setData({
              items: items
            });
          }
        }
        else {
          console.log('error');
          console.log(res);
        }
      }
    });
  }
})
