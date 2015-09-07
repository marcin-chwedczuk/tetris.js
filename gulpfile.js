(function() {
    'use strict';

    var gulp = require('gulp');
    var clean = require('gulp-clean');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var gutil = require('gulp-util');
    var rename = require('gulp-rename');
    var filesize = require('gulp-filesize');
    var watch = require('gulp-watch');
    var batch = require('gulp-batch');
    var mocha = require('gulp-mocha');
    var jshint = require('gulp-jshint');
    var betterConsole = require('better-console');
    var source = require('vinyl-source-stream');
    var browserify = require('browserify');
    var program = require('commander');
    var express = require('express');
    var path = require('path');
    var sass = require('gulp-sass');
    var sourcemaps = require('gulp-sourcemaps');
    var gulpif = require('gulp-if');
    var browserSync = require('browser-sync').create();

    var SOURCE_DIR = 'src';
    var DEST_DIR = 'dist';
    var TEST_DIR = 'test';
    var STYLES_DIR = 'styles';
    var ASSETS_DIR = 'assets';
    var TMP_DIR = 'tmp';

    var PROGRAM_NAME = 'tetris';

    var SOURCE_JS_FILES = SOURCE_DIR + '/*.js';
    var SOURCE_STYLE_FILES = STYLES_DIR + '/*.scss';
    var SOURCE_TEMPLATE_FILES = SOURCE_DIR + '/*.html';
    var SOURCE_ASSET_FILES = ASSETS_DIR + '/*';
    var FAVICON_ASSET_FILE = ASSETS_DIR + '/favicon.ico';

    var TEST_JS_FILES = TEST_DIR + '/*.js';

    var DEST_JS_FILES = DEST_DIR + '/*.js';
    var DEST_ASSET_DIR = DEST_DIR + '/' + ASSETS_DIR;

    var JSHINT_REPORTER = 'jshint-stylish';

    program.on('--help', function(){
      console.log('  Tasks:');
      console.log();
      console.log('    build       build the game');
      console.log('    clean       delete generated files');
      console.log('    serve       launch development server with auto reload');
      console.log('    watch       watch for file changes and rebuild automatically');
      console.log();
    });

    program
        .usage('<task> [options]')
        .option('-R, --release', 'strip debug info')
        .parse(process.argv);

    var release = !!program.release;

    gulp.task('jshint', function() {
        return gulp.src([SOURCE_JS_FILES, TEST_JS_FILES])
            .pipe(jshint())
            .pipe(jshint.reporter(JSHINT_REPORTER))
            .pipe(jshint.reporter('fail'))
    });

    gulp.task('browserify', function() {
        var b = browserify([SOURCE_DIR + '/main.js'], { 
            debug: !release,
            standalone: PROGRAM_NAME,
            paths: ['./src']
        });

        return b.bundle()
            .pipe(source(PROGRAM_NAME + '.bs.js'))
            .pipe(gulp.dest(TMP_DIR));
    });

    gulp.task('htmlTemplates', function() {
        return gulp.src(SOURCE_TEMPLATE_FILES)
            .pipe(gulp.dest(DEST_DIR))
            .on('error', gutil.log);
    });

    gulp.task('htmlAssets', function() {
        // assets without favicon
        return gulp.src([SOURCE_ASSET_FILES, '!' + FAVICON_ASSET_FILE])
            .pipe(gulp.dest(DEST_ASSET_DIR))
            .on('error', gutil.log);
    });

    gulp.task('favicon', function() {
        return gulp.src(FAVICON_ASSET_FILE)
            .pipe(gulp.dest(DEST_DIR))
            .on('error', gutil.log);
    });

    var createSassStylesPipeline = function() {
        return gulp.src(SOURCE_STYLE_FILES)
            .pipe(gulpif(!release, sourcemaps.init()))
            .pipe(sass({ 
                outputStyle: (release ? 'compressed' : 'expanded')
            }).on('error', sass.logError))
            .pipe(concat(PROGRAM_NAME + '.css'))
            .pipe(gulp.dest(DEST_DIR));
    };

    gulp.task('sassStyles', function() {
        return createSassStylesPipeline();
    });

    gulp.task('browserSync:sassStyles', function() {
        return createSassStylesPipeline()
            .pipe(browserSync.stream());
    });

    gulp.task('build', ['jshint', 'browserify', 'sassStyles', 'htmlTemplates', 'htmlAssets', 'favicon'],
    function() {
        gutil.log('BUILDING IN ' + (release ? 'RELEASE' : 'DEBUG') + ' MODE');

        return gulp.src(TMP_DIR + '/' + PROGRAM_NAME + '.bs.js')
            .pipe(gulpif(release, uglify()))
            .pipe(rename(PROGRAM_NAME + '.js'))
            .pipe(gulp.dest(DEST_DIR))
            .pipe(filesize())
            .on('error', gutil.log);
    });

    gulp.task('browserSync:build', ['build'], browserSync.reload);

    gulp.task('test', ['build'], function() {
        return gulp.src(TEST_JS_FILES, { read: false })
            .pipe(mocha({
                style: 'bdd',
                reporter: 'nyan',
            }));
    });

    gulp.task('clean', function() {
        return gulp.src([DEST_DIR+'/*', TMP_DIR+'/*'], { read: false })
            .pipe(clean())
            .on('error', gutil.log);
    });

    gulp.task('watch', function() {
        var filesToWatch = [
            SOURCE_JS_FILES,
            TEST_JS_FILES,
            SOURCE_STYLE_FILES,
            SOURCE_TEMPLATE_FILES,
            SOURCE_ASSET_FILES
        ];

        watch(filesToWatch, batch(function(events, done) {
            betterConsole.clear();
            gulp.start('test', done);
        }));
    });
   
    gulp.task('default', ['build'], function() {});

    gulp.task('serve', ['build'], function () {

        // Serve files from the root of this project
        browserSync.init({
            port: 8666,
            server: {
                baseDir: './' + DEST_DIR,
                index: PROGRAM_NAME + '.html',
            }
        });

        gulp.watch(SOURCE_STYLE_FILES, ['browserSync:sassStyles']);
        gulp.watch(SOURCE_JS_FILES, ['browserSync:build']);
        gulp.watch(TEST_JS_FILES, ['test']);
        gulp.watch(SOURCE_TEMPLATE_FILES, ['browserSync:build']);
        gulp.watch(SOURCE_ASSET_FILES, ['browserSync:build']);
    });

}());
