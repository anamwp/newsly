var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify-es').default;
var zip = require('gulp-zip');
var del = require('del');
/**
 * compile style
 */
gulp.task('styles', () => {
    return gulp.src(['assets/scss/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(minify())
        .pipe(gulp.dest('./dist/css/'));
});
/**
 * compile javascript
 */
gulp.task('js', () => {
  return gulp.src('assets/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'));
});
/**
 * compile images
 */
gulp.task('images', function () {
  return gulp.src('assets/images/*.{jpg,png}')
      .pipe(gulp.dest('./dist/images/'));
});
/**
 * clean unnecessary file
 */
gulp.task('clean', () => {
  return del([
      'dist/',
      '*.zip',
  ]);
});
/**
 * file watcher task
 */
gulp.task('watch', () => {
  gulp.watch('assets/scss/**/*', gulp.series(['styles']));
  gulp.watch('assets/js/*', gulp.series(['js']));
});
/**
 * build 
 */
gulp.task('build', gulp.series(['clean', 'styles', 'js', 'images']));
/**
 * default command to start the process
 */
gulp.task('default', gulp.series(['build', 'watch']));
/**
 * package command to 
 * zip necessary files for plugin
 */
gulp.task('package', async function () {
  gulp.src([
      './**',
      './*/**',
      '!./bower_components/**',
      '!./node_modules/**',
      '!./bower_components',
      '!./node_modules',
      '!./assets/**',
      '!gulpfile.js',
      '!package.json',
      '!composer.json',
      '!*.json',
      '!*.log',
      '!*.zip',
      '!*.config.js',
      '!*.lock',
      '!*.phar',
      '!*.xml',
  ])
    .pipe(zip('wp-plugin-starter.zip'))
    .pipe(gulp.dest('.'));
});


