var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var copy = require('gulp-copy');
var rename = require('gulp-rename');

var clean = require('gulp-clean');
var replace = require('gulp-replace');

var del = require('del');

var stylesheets = [
    '**/*.scss'
];

// converts sass into final stylesheet file
gulp.task('sass', function () {
    return gulp
        .src('sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: stylesheets
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});

// serve up using browsersync
gulp.task('serve', function() {
    browserSync.init({ server: '.' });

    // watch files and build/reload where needed
    gulp.watch(['**/*.scss'], gulp.series('sass'));
    gulp.watch('**/*.html').on('change', browserSync.reload);
});

// when running `gulp build` for a static build
gulp.task('build', gulp.series('sass'));

// when running `gulp` to build, watch and re-build
gulp.task('default', gulp.series('build', 'serve'));

var filesToMove = [
    './css/**/*.*',
    './scripts/**/*.*',
    './images/**/*.*',
    './webfonts/**/*.*'
];

gulp.task('build-prod', gulp.series('sass', async function() {
    del(['dist/**', '!dist'], {force:true});

    gulp.src('dist', {read: false, allowEmpty: true}).pipe(clean());

    gulp.src(filesToMove, { base: './' }).pipe(gulp.dest('dist'));

    gulp.src(['index.html']).pipe(replace('{TIMESTAMP}', Date.now())).pipe(gulp.dest('dist/'));
}));
