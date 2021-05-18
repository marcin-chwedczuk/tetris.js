const gulp = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpUtil = require('gulp-util');
const rename = require('gulp-rename');
const filesize = require('gulp-filesize');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const betterConsole = require('better-console');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

const PROGRAM_NAME = 'tetris';

const SOURCE_DIR = 'src';
const STYLES_DIR = 'styles';
const ASSETS_DIR = 'assets';
const TEST_DIR = 'test';
const TMP_DIR = 'tmp';
const DEST_DIR = 'dist';

const SOURCE_JS_FILES = SOURCE_DIR + '/**/*.js';
const SOURCE_STYLE_FILES = STYLES_DIR + '/*.scss';
const SOURCE_TEMPLATE_FILES = SOURCE_DIR + '/*.html';
const SOURCE_ASSET_FILES = ASSETS_DIR + '/*';
const FAVICON_ASSET_FILE = ASSETS_DIR + '/favicon.ico';

const TEST_JS_FILES = TEST_DIR + '/*.js';

const DEST_JS_FILES = DEST_DIR + '/*.js';
const DEST_ASSET_DIR = DEST_DIR + '/' + ASSETS_DIR;

const IS_RELEASE_BUILD = !!process.env.RELEASE;
const IS_CI_ENV = !!process.env.CI_BUILD;

function jshintTask() {
        return gulp.src([SOURCE_JS_FILES, TEST_JS_FILES])
                .pipe(jshint({
                        esversion: 6
                }))
                .pipe(jshint.reporter('jshint-stylish'))
                .pipe(jshint.reporter('fail'));
}

function browserifyTask() {
        // Browserify provides a module system (think `require()`)
        const b = browserify([SOURCE_DIR + '/main.js'], {
                debug: !IS_RELEASE_BUILD,
                standalone: PROGRAM_NAME,
                paths: ['./src']
        });

        return b.bundle()
                .pipe(source(PROGRAM_NAME + '.bs.js'))
                .pipe(gulp.dest(TMP_DIR));
}

function htmlTemplatesTask() {
        return gulp.src(SOURCE_TEMPLATE_FILES)
                .pipe(gulp.dest(DEST_DIR))
                .on('error', gulpUtil.log);
}

function htmlAssetsTask() {
        // assets without favicon
        return gulp
                .src([SOURCE_ASSET_FILES, '!' + FAVICON_ASSET_FILE])
                .pipe(gulp.dest(DEST_ASSET_DIR))
                .on('error', gulpUtil.log);
}

function faviconTask() {
        return gulp.src(FAVICON_ASSET_FILE)
                .pipe(gulp.dest(DEST_DIR))
                .on('error', gulpUtil.log);
}

function sassStylesTask() {
        return gulp.src(SOURCE_STYLE_FILES)
                .pipe(gulpIf(!IS_RELEASE_BUILD, sourcemaps.init()))
                .pipe(
                        sass({
                                outputStyle: (IS_RELEASE_BUILD ? 'compressed' : 'expanded'),
                        })
                        .on('error', sass.logError)
                )
                .pipe(autoprefixer({
                        // browsers: ['last 2 version'],
                        // cascade: false
                }))
                .pipe(concat(PROGRAM_NAME + '.css'))
                .pipe(gulpIf(!IS_RELEASE_BUILD, sourcemaps.write('.')))
                .pipe(gulp.dest(DEST_DIR));
}


function uglifyTask() {
        return gulp.src(TMP_DIR + '/' + PROGRAM_NAME + '.bs.js')
                .pipe(gulpIf(IS_RELEASE_BUILD, uglify()))
                .pipe(rename(PROGRAM_NAME + '.js'))
                .pipe(gulp.dest(DEST_DIR))
                .pipe(filesize())
                .on('error', gulpUtil.log);
}

function logBuildInfoTask(done) {
        gulpUtil.log('Build information:')
        gulpUtil.log('\tConfiguration: ' + (IS_RELEASE_BUILD ? 'RELEASE' : 'DEBUG'));
        done();
}

const buildTask = gulp.series(
        jshintTask, 
        browserifyTask, 
        sassStylesTask, 
        htmlTemplatesTask, 
        htmlAssetsTask, 
        faviconTask, 
        logBuildInfoTask, 
        uglifyTask);

function runTestsTask() {
        return gulp
                .src(TEST_JS_FILES, { read: false })
                .pipe(mocha({
                        style: 'bdd',
                        reporter: (IS_CI_ENV ? 'spec' : 'nyan'),
                }));
}

const testTask = gulp.series(buildTask, runTestsTask);

function cleanTask() {
        return gulp.src([DEST_DIR + '/*', TMP_DIR + '/*'], { read: false })
                .pipe(clean())
                .on('error', gulpUtil.log);
}

function clearConsoleTask(done) {
        betterConsole.clear();
        done();
}

function watchTask() {
        const filesToWatch = [
                SOURCE_JS_FILES,
                TEST_JS_FILES,
                SOURCE_STYLE_FILES,
                SOURCE_TEMPLATE_FILES,
                SOURCE_ASSET_FILES
        ];

        gulp.watch(filesToWatch, gulp.series(clearConsoleTask, testTask));
}

/* Browser sync integration, I am not a JS pro but this looks
   more complicated than it should be. */
function browserSyncReloadTask(done) {
        browserSync.reload();
        done();
}

const browserSyncBuildTask = gulp.series(buildTask, browserSyncReloadTask);

function browserSyncSassStylesTask() {
        return sassStylesTask()
                .pipe(browserSync.stream());
}

function browserSyncTask(done) {
        // Serve files from the root of this project
        browserSync.init({
                port: 8666,
                server: {
                        baseDir: './' + DEST_DIR,
                        index: PROGRAM_NAME + '.html',
                }
        });

        gulp.watch(SOURCE_STYLE_FILES, browserSyncSassStylesTask);
        gulp.watch(SOURCE_JS_FILES, browserSyncBuildTask);
        gulp.watch(TEST_JS_FILES, testTask);
        gulp.watch(SOURCE_TEMPLATE_FILES, browserSyncBuildTask);
        gulp.watch(SOURCE_ASSET_FILES, browserSyncBuildTask);

        done();
}

const serveTask = gulp.series(buildTask, browserSyncTask);

exports.default = gulp.series(cleanTask, buildTask, runTestsTask);
exports.build = buildTask;
exports.test = testTask;
exports.clean = cleanTask;
exports.serve = serveTask;
exports.watch = watchTask;
