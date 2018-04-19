'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

gulp.task('watch', ['inject'], function () {
  gulp.watch([
    paths.src + '/*.html',
      'bower.json',
    paths.src + '/{app,components}/**/*.less',
    paths.src + '/{app,components}/**/*.js'
  ], ['inject']);
});
