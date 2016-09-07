'use strict';

const PLUGIN_NAME = 'gulp-studio-push';

let StudioHelper = require('studio-helper'),
    gutil = require('gulp-util'),
    through = require('through2'),
    studio = null;

module.exports = function(settings) {
  let pushStarted = false;

  if(!studio) {

    if(!settings) {
      throw new PluginError(PLUGIN_NAME, 'Settings (object) missing');
    }

    if(!settings.studio) {
      throw new PluginError(PLUGIN_NAME, "Settings: property 'studio' (string) missing");
    }

    if(!settings.folders) {
      throw new PluginError(PLUGIN_NAME, "Settings: property 'folders' (Array<object>) missing");
    }

    studio = new StudioHelper(settings);
  }

  return through.obj(function (file, encoding, callback) {

    if(pushStarted) {
      callback(null, file);
      return;
    }

    studio.push(settings).then(function (results) {
      if (!results.length) {
        console.log('[Studio] No changes to upload');
      } else {
        console.log('[Studio] ' + results.length + ' ' + (results.length === 1 ? 'file' : 'files') + ' uploaded');
      }
      callback(null, file);
    });

    pushStarted = true;

  });
};
