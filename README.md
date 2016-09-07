# Crasman Studio push plugin for gulp

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
      proxy: 'http://foo.intra:8080/',
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