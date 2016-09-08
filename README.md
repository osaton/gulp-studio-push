# Crasman Studio push plugin for gulp

## What is this

Modern version of the legendary push.php. Windows users can ditch Cygwin - no PHP here, only Node.

## Installation

```bash
$ npm install gulp-studio-push --save-dev
$ echo '.studio-credentials' >> .gitignore # Add .studio-credentials to .gitignore file
```

## gulpfile example:
```javascript
var studioPush = require('gulp-studio-push'),
    studioSettings = {
      studio: 'foo.studio.crasman.fi',
      proxy: 'http://foo.intra:8080/', // Optional, but with this set, you don't have to worry about setting HTTP_PROXY anymore
      folders: [{
        folderId: '568a7a2aadd4532b0f4f4f5b',
        localFolder: 'dist/js'
      }, {
        folderId: '568a7a27add453aa1a4f4f58',
        localFolder: 'dist/css'
      }]
    };

gulp.task('push', function () {
  return gulp.src('').pipe(studioPush(studioSettings));
});
```