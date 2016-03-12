import path from 'path';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import postcss from 'gulp-postcss';
import symlink from 'gulp-sym';
import bemLinter from 'postcss-bem-linter';
import reporter from 'postcss-reporter';

import config from './config';

gulp.task('hooks', () => {
  return gulp.src(['.git-hooks/pre-push'])
    .pipe(symlink(['.git/hooks/pre-push'], {
      relative: true,
      force: true
    }));
});

gulp.task('lintjs', () => {
  return gulp.src([path.join(config.src, '**/*.js')])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lintcss', () => {
  return gulp.src([path.join(config.src, '**/*.css')])
    .pipe(postcss([
      bemLinter(),
      reporter({
        clearMessages: true,
        throwError: true
      })
    ]));
});

gulp.task('lint', ['lintcss', 'lintjs']);

require('./gulpfile.dev');
require('./gulpfile.dist');
