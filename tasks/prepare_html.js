import gulp from 'gulp';
import rename from 'gulp-rename';
import render from 'gulp-nunjucks-render';

const nunjucks = render.nunjucks;

export default (options) => {
  return () => {
    nunjucks.configure(options.src, {
      watch: false
    });

    let context;

    if (options.context) {
      context = options.context();
    }

    return gulp.src(options.files, { base: options.src })
      .pipe(render(context))
      .pipe(rename(path => {
        path.basename = path.basename.replace(/\.dev|\.dist|\.all/, '');
      }))
      .pipe(gulp.dest(options.dest));
  };
};
