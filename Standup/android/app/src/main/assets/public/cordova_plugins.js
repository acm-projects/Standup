
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-firebase.FirebasePlugin",
          "file": "plugins/cordova-plugin-firebase/www/firebase.js",
          "pluginId": "cordova-plugin-firebase",
        "clobbers": [
          "FirebasePlugin"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-firebase": "2.0.5"
    };
    // BOTTOM OF METADATA
    });
    