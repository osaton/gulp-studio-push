# Basic multiple folders setup

```javascript
var gulp = require('gulp'),
    studioPush = require('gulp-studio-push'),
    studioSettings = {
      studio: 'foo.studio.crasman.fi',
      proxy: 'http://foo.intra:8080/', // Optional, but with this set, you don't have to worry about setting HTTP_PROXY anymore
      ignoreFile: '.studio-ignore-2', // Only needed if you don't want to use the default ignore file (.studio-ignore)
      folders: [{
        folderId: '568a7a2aadd4532b0f4f4f5b',
        localFolder: 'dist/js',
        includeSubFolders: true // Create and upload child folders too (^1.2.1), default false
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
