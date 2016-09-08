# Crasman Studio push plugin for gulp

## What is this

Modern version of the legendary push.php. Windows users can ditch Cygwin - no PHP here, only Node.

## Installation

```bash
$ npm install gulp-studio-push --save-dev
$ echo '.studio-credentials' >> .gitignore # Add .studio-credentials to .gitignore file
```

## gulpfile examples:
```javascript
var gulp = require('gulp'),
    studioPush = require('gulp-studio-push'),
    studioSettings = {
      studio: 'foo.studio.crasman.fi',
      proxy: 'http://foo.intra:8080/', // Optional, but with this set, you don't have to worry about setting HTTP_PROXY anymore
      folders: [{
        folderId: '568a7a2aadd4532b0f4f4f5b',
        localFolder: 'dist/js'
      }, {
        folderId: '568a7a27add453aa1a4f4f58',
        localFolder: 'dist/css'
      }, {
        folderId: '568a7a27add453aa1a4f4f58',
        localFolder: 'dist/img'
      }, {
        folderId: '568a7a27add453aa1a4f4f58',
        localFolder: 'other/folder'
      }]
    };

// Upload all folders
gulp.task('push', function () {
  return gulp.src('.').pipe(studioPush(studioSettings));
});

// Upload dist/img folder
gulp.task('push-images', function () {
  return gulp.src('dist/img').pipe(studioPush(studioSettings));
});

// Upload all folders starting with 'dist' (dist/js, dist/css, dist/img)
gulp.task('push-dist', function () {
  return gulp.src('dist').pipe(studioPush(studioSettings));
});

// Upload css and js
gulp.task('push-foo', function () {
  return gulp.src(['dist/js', 'dist/css']).pipe(studioPush(studioSettings));
});
```