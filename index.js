'use strict';

const PLUGIN_NAME = 'gulp-studio-push';

let StudioHelper = require('studio-helper'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    fs = require('fs'),
    path = require('path'),
    through = require('through2'),
    studio = null;

module.exports = function(settings) {
  let pushStarted = false,
      currentDir = process.cwd(),
      folders = [],
      filteredFolders = [];

  if(!studio) {

    if(!settings) {
      throw new PluginError(PLUGIN_NAME, 'Settings (object) missing');
    }

    if(typeof settings !== 'object') {
      throw new PluginError(PLUGIN_NAME, 'Object expected');
    }

    if(!settings.studio) {
      throw new PluginError(PLUGIN_NAME, "Settings: property 'studio' (string) missing");
    }

    if(!settings.folders) {
      throw new PluginError(PLUGIN_NAME, "Settings: property 'folders' (Array<object>) missing");
    }

    studio = new StudioHelper(settings);
  }

  // Deep copy folders
  folders = JSON.parse(JSON.stringify(settings.folders));


  return through.obj(function (file, encoding, callback) {
    let relativePath;

    if(file.isNull()) {

      // Folder
      relativePath = fs.realpathSync(file.path).replace(path.join(currentDir, '/'), '');
    } else {

      // File
      relativePath = path.dirname(fs.realpathSync(file.path)).replace(path.join(currentDir, '/'), '');
    }

    // If root dir, include all folders
    if(currentDir === fs.realpathSync(file.path)) {
      filteredFolders = folders.slice(0, folders.length);
    }

    for(let i=folders.length-1; i>=0; i--) {
      let folder = folders[i],
          folderPath = path.normalize(folder.localFolder);

      // If path is found in passed folders add it
      if(folderPath.indexOf(relativePath) === 0) {
        filteredFolders.push(folders.splice(i, 1)[0]);
      }
    }

    callback(null, file);

  }, function (callback) {

    if(!filteredFolders.length) {
      console.log('[' + PLUGIN_NAME + '] No folders found to upload');
      callback();
      return;
    }

    // And push filteredFolders to Studio
    return studio.push({
      folders: filteredFolders
    }).then(function (results) {
      if (!results.length) {
        console.log('[Studio] No changes to upload');
      } else {
        console.log('[Studio] ' + results.length + ' ' + (results.length === 1 ? 'file' : 'files') + ' uploaded');
      }
      callback();
    });
  });
};
