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

## Example

```js
// Push everything found in dist folder to Studio
gulp.task('push', function () {
  var studioPush = require('gulp-studio-push');
  var studioSettings = {
    studio: 'foo.studio.crasman.fi',
    proxy: 'http://foo.intra:8080/',
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
      createdFileSettings: {
        // For master and release-* branch Service Workers (sw.js or service-worker.js)
        'dist/(master|release-.*)/(sw.js|service-worker.js)': { // RegExp match
          'Service-Worker-Allowed': '/', // Allow from root of domain
          'Cache-Control': 'public, max-age=60, s-maxage=60' // Use very short max age for Service Workers in production
        },
        // development branch Service Workers
        'dist/.*/(sw.js|service-worker.js)': { // RegExp match
          'Service-Worker-Allowed': '/', // Allow from root of domain
          'Cache-Control': 'private, must-revalidate, no-cache, no-store, max-age=0, s-maxage=0' // no cache for development branch Service Workers
        },
      }
    }]
  };
  return gulp.src('dist').pipe(studioPush(studioSettings));
});
```