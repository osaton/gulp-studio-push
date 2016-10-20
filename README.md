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
!dist/img/janne-loop.gif
```

## Examples

### Basic multiple folders setup
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

### Git branch uploading (^1.2.1)

Install plugins needed for this example:
```bash
npm install gulpjs/gulp#4.0 gulp-file yargs gulp-studio-push --save-dev
```
```javascript
var gulp = require('gulp');
var file = require('gulp-file');
var argv = require('yargs').argv;
var execSync = require('child_process').execSync;

// Get current branch
var branch = execSync('git symbolic-ref -q --short HEAD').toString('utf-8').trim();

// Assumes that 'master' is the production branch
// If this is production branch, require --production flag
if(branch === 'master' && !argv.production) {
  console.log('Master (production!) branch needs to be built with \`gulp --production\`');
  console.log('For development purposes create another branch.');
  return;
}

var path = {
  dist: {
    root  : 'dist/',
    css   : 'dist/' + branch + '/css/',
    js    : 'dist/' + branch + '/js/',
  }
};

// It's important to clean the dist folder when we start gulp, so that
// we don't accidentally upload other branches too
gulp.task('clean', function () {
  var del = require('del');
  return del([path.dist.root]);
});

// Push everything found in dist folder to Studio
gulp.task('push', function () {
  var studioPush = require('gulp-studio-push');
  var studioSettings = {
    studio: 'foo.studio.crasman.fi',
    proxy: 'http://foo.intra:8080/',
    folders : [{
      folderId: '5807aedb2b089f6b6f44cfaf',
      localFolder: 'dist',
      includeSubFolders: true
    }]
  };
  return gulp.src('dist').pipe(studioPush(studioSettings));
});

// Create some dummy files for demonstration purposes
// Replace with a task of your own
gulp.task('js', function () {
  return file('file.js', 'test', { src: true })
  .pipe(gulp.dest(path.dist.js));
});

// Create some dummy files for demonstration purposes
// Replace with a task of your own
gulp.task('css', function () {
  return file('file.css', 'test', { src: true })
  .pipe(gulp.dest(path.dist.css));
});

// Build everything
gulp.task('build', gulp.series('clean', gulp.parallel('js', 'css'), 'push'));

// Default
gulp.task('default', gulp.series('build'));

```
Studio folder structure after push:
```
{studioFolder}
│   branches.json
└───{branch}
|   └───css
|    │   file.css
|    └───js
|        file.js
└───some-other-branch
└───master
```
You can then use ['studio-folder://5807aedb2b089f6b6f44cfaf/.getFolders()](https://wiki.crasman.fi/confluence/display/stageguide/getFolders) in Stage to get the child folders (branches) and [create a branch selector](examples/branches/).
