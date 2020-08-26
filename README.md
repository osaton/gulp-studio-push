# Crasman Studio push plugin for gulp

## What is this

Modern version of the legendary push.php. Windows users can ditch Cygwin - no PHP here, only Node.

## Installation

```bash
$ npm install gulp-studio-push --save-dev
$ echo '.studio-credentials' >> .gitignore # Add .studio-credentials to .gitignore file
```

## Ignoring unwanted files
[Ignore patterns](https://git-scm.com/docs/gitignore) can be added to `.studio-ignore` file.

#### .studio-ignore example:
```gitignore
.DS_Store
dist/img/*.gif
!dist/img/allowed.gif
```

## Examples


### Push with different cache times for dev / production folders and Service Workers
```javascript
gulp.task('push', function () {
  const studioPush = require('gulp-studio-push');
  const studioSettings = {
    studio: 'foo.studio.crasman.fi',
    proxy: 'http://foo.intra:8080/',
    concurrentUploads: 4 // Default 5, max 5 
    // Only needed if you don't want to use the default ignore file (.studio-ignore)
    //ignoreFile: '.studio-ignore-2', 
    folders : [{
      folderId: '5807aedb2b089f6b6f44cfaf',
      localFolder: 'dist',
      includeSubFolders: true,
      createdFolderSettings: { // Cache settings for created folders
        'dist/master': { // RegExp match
          fileCacheMaxAge: 604800 // Week for master files
        },
        'dist/release-.*?': { // RegExp match
          fileCacheMaxAge: 604800 // Week for release-0.1, release-0.2 etc.
        },
        'dist/.*?': { // RegExp match
          fileCacheMaxAge: 1 // 1 second for everything else (dev branches)
        }
      },
      createdFileHeaders: { // (version ^1.5.0)
        // For master and release-* branch Service Workers (sw.js or service-worker.js)
        'dist/(master|release-.*)/(sw.js|service-worker.js)': { // RegExp match
          'Service-Worker-Allowed': '/', // Allow from root of domain
          'Cache-Control': 'public, max-age=60, s-maxage=60' // Use very short max age for Service Workers in production
        },
        // development branch Service Workers
        'dist/.*/(sw.js|service-worker.js)': { // RegExp match
          'Service-Worker-Allowed': '/', // Allow from root of domain
          'Cache-Control': 'private, must-revalidate, no-cache, no-store, max-age=0, s-maxage=0' // no cache for development branch Service Workers
        }
      }
    }]
  };
  return gulp.src('dist').pipe(studioPush(studioSettings));
});
```

### Different gulp tasks for pushing specific folders

```javascript
const gulp = require('gulp');
const studioPush = require('gulp-studio-push');
const studioSettings = {
  studio: 'foo.studio.crasman.fi',
  proxy: 'http://foo.intra:8080/',
  folders: [{
    folderId: '568a7a2aadd4532b0f4f4f5b',
    localFolder: 'dist/js',
    includeSubFolders: true // Create and upload child folders too
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