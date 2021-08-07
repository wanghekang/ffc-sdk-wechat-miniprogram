// app.js
const plugin = requirePlugin('hello-plugin')
App({
  onLaunch() {
    plugin.init(
      {
        "ffUserName": "hu-beau",
        "ffUserEmail": "hu-beau@outlook.com",
        "ffUserKeyId": "hu-beau@outlook.com",
        "ffUserCustomizedProperties": [
          {
            "name": "groups",
            "value": "1"
          },
          {
            "name": "version",
            "value": "1.0.x"
          }
        ]
      },
      "MzkwLWZlYjctNCUyMDIxMDczMTExNDkwNV9fNF9fMl9fNF9fZGVmYXVsdF9hNGIyYQ=="
    );

  }
})
