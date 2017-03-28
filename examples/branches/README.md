# Git branch uploading (^1.3.0)

This method allows multiple developers as everyone is developing on separate branches, and only pushes master when things are working.

Also allows easy demoing of features as you could create branch selector right in Stage page's metadata and force wanted branch for users visiting that page.

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
      includeSubFolders: true,
      createdFolderSettings: { // Cache settings for created folders
        'dist/master': {
          fileCacheMaxAge: 604800 // Week for master files
        },
        'dist/release-.*?': {
          fileCacheMaxAge: 604800 // Week for release-0.1, release-0.2 etc.
        },
        'dist/.*?': {
          fileCacheMaxAge: 1 // 1 second for everything else (dev branches)
        }
      }
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
You can then use ['studio-folder://5807aedb2b089f6b6f44cfaf/.getFolders()](https://wiki.crasman.fi/confluence/display/stageguide/getFolders) in Stage to get the child folders (branches) and create a branch selector.

## Creating simple branch selector in Stage

[Example page template](page.html)

[Site.getBranchesData(folderRef, Cookie, Post)](get-branches-data.js)
