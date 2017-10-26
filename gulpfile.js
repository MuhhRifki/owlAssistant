'use strict';

const gulp = require('gulp'),
    inject = require('gulp-inject'),
    webserver = require('gulp-webserver'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin')

var err = 'error',
    paths = {
        // Source
        srcHTML: './src/html/*.html',
        srcSASS: './src/sass/main.scss',
        srcJS: './src/js/*.js',
        srcImg: './src/img/**/*.+(png|jpg|gif|svg)',

        // Development
        dev: './dev',
        devCss: './dev/css',
        devJs: './dev/js',
        devImg: './dev/img',
        devHTML: './dev',

        // Production 
        // dist:       './dist',
        // distIndex:  './dist/index.html',
        // distCSS:    './dist/**/*.css',
        // distJS:     './dist/**/*.js',
    },
    task = {
        html: 'html',
        sass: 'sass',
        js: 'js',
        img: 'img'
    }

// HTML task
gulp.task(task.html, () => {
    return gulp.src(paths.srcHTML)
        .pipe(gulp.dest(paths.devHTML))
})


// SASS
gulp.task(task.sass, () => {
    return gulp.src(paths.srcSASS)
        .pipe(sass.sync().on(err, sass.logError))
        .pipe(gulp.dest(paths.devCss))
})

// JS
gulp.task(task.js, () => {
    return gulp.src(paths.srcJS).
    pipe(gulp.dest(paths.devJs))
})

// IMG
gulp.task(task.img, () => {
    return gulp.src(paths.srcImg)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.devImg))
})

gulp.task('inject', ['task'], () => {
    let css = gulp.src([paths.devCss + '/*.css', paths.devJs + '/*.js'], { read: false })

    return gulp.src(paths.devHTML + '/*.html')
        .pipe(inject(css, { ignorePath: 'dev', addRootSlash: false }))
        .pipe(gulp.dest(paths.dev))
})

gulp.task('serve', ['inject'], () => {
    return gulp.src('./dev/')
        .pipe(webserver({
            port: 3002,
            host: '0.0.0.0',
            livereload: true
        }))
})

gulp.task('watch', ['serve'], () => {
    gulp.watch('./src/**', ['inject'])
})

gulp.task('default', ['watch'])

gulp.task('task', [task.html, task.js, task.sass, task.img])