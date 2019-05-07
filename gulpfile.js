'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass'); // компилирует в css
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer'); // добавляет в css префиксы
const browserSync = require('browser-sync').create(); // запускает локальный браузер Синк
const notify = require('gulp-notify'); // отлов ошибок
const plumber = require('gulp-plumber');
const multipipe = require('multipipe'); // отлов ошибок

gulp.task('sass', function () {
    return multipipe(
        gulp.src('app/sass/app.scss'),
        plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'scss',
                    message: err.message
                };
            })
        }),
        sourcemaps.init(),
        sass(),
        autoprefixer({
            browsers: ['last 16 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: true
        }),
        sourcemaps.write('.'),
        gulp.dest('app/css')
    ).on('error', notify.onError());
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.*', gulp.series('sass'));
});


gulp.task('serve', function () {
    browserSync.init({
        server: 'app'
    });

    browserSync.watch('app/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch', 'serve'));










