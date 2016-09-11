'use strict';

let gulp = require('gulp'),
		mocha = require('gulp-mocha'),
		gutil = require('gulp-util');


gulp.task('tests', [], function () {
	return gulp.src('tests/*.js', {read: false})
    .pipe(mocha({
      reporter: 'dot',
      globals: {
        //chai: require('chai'),
        //fs: require('fs'),
      }
    }))
    .once('error', function(e) {
      gutil.log(e);
    });
});

gulp.task('watch', [], function () {
	gulp.watch(['./index.js'], ['tests']);
}['tests']);

gulp.task('default', [], function () {
	gulp.start('tests', 'watch');
});