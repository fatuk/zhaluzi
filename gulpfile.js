var gulp = require('gulp'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch'),
	browserSync = require('browser-sync'),
	minifyCSS = require('gulp-minify-css'),
	mainBowerFiles = require('main-bower-files'),
	bowerFiles = mainBowerFiles(),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	gutil = require('gulp-util'),
	ftp = require('gulp-ftp'),
	ftpCredentials = require('./tmp/ftp.json'),
	buildPath = 'public';

console.info('********** Bower Files **********');
console.info(bowerFiles);


// TODO: Add sprites http://habrahabr.ru/post/227945/

/******************************
 * Default task
 ******************************/
gulp.task('default', [
	'copyAssets',
	'pluginsConcat',
	'jsConcat',
	'less',
	'browser-sync',
	'watch'
]);

/******************************
 * Copy assets to public
 ******************************/
gulp.task('copyAssets', function () {
	'use strict';
	gulp.src([
		'assets/**/*.*',
		'!assets/**/*.less',
		'app/**/*.html',
		'!assets/data/*.*',
		'!app/index.html'
	])
		.pipe(gulp.dest('../design-okna.brainmaze.net'))
		.pipe(gulp.dest('public'));
});

/******************************
 * FTP task
 ******************************/
gulp.task('ftp', function () {
	return gulp.src([
			'public/**/*.js',
			'public/**/*.html',
			'public/**/*.css'
		])
		.pipe(ftp({
			host: 'brainmaze.net',
			user: ftpCredentials.login,
			pass: ftpCredentials.pass,
			remotePath: '/static'
		}))
		// you need to have some kind of stream after gulp-ftp to make sure it's flushed
		// this can be a gulp plugin, gulp.dest, or any kind of stream
		// here we use a passthrough stream
		.pipe(gutil.noop());
});

/******************************
 * Imagemin task
 ******************************/
gulp.task('image-min', function () {
	return gulp.src('app/img/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}]
		}))
		.pipe(gulp.dest('app/img.min/'));
});

/******************************
 * JS plugins
 ******************************/
gulp.task('pluginsConcat', function () {
	gulp.src(bowerFiles)
		.pipe(concat('plugins.min.js'))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(gulp.dest('../design-okna.brainmaze.net/js'))
		.pipe(gulp.dest('public/js'));
});

/******************************
 * JS concat
 ******************************/
gulp.task('jsConcat', function () {
	gulp.src(['app/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('../js'))
		.pipe(gulp.dest('../design-okna.brainmaze.net/js'))
		.pipe(gulp.dest('public/js'));
});

/******************************
 * Browser sync
 ******************************/
gulp.task('browser-sync', function () {
	var files = [
		'public/*.html',
		'public/js/**/*.js',
		'public/css/**/*.css'
	];

	browserSync.init(files, {
		ghostMode: false,
		server: {
			baseDir: './public'
		},
		open: false
	});
});

/******************************
 * Watch
 ******************************/
gulp.task('watch', function () {
	gulp.watch('assets/less/*.less', ['less']);
	gulp.watch('app/**/*.js', ['jsConcat']);
	gulp.watch(['assets/**/*', '!assets/**/*.less', 'app/**/*.html'], ['copyAssets']);
});

/******************************
 * Less
 ******************************/
gulp.task('less', function () {
	gulp.src('assets/less/app.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 5 versions', 'ff >= 24'],
			cascade: false
		}))
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest('../design-okna.brainmaze.net/css'))
		.pipe(gulp.dest('public/css'));
});

/******************************
 * Less min
 ******************************/
gulp.task('less-min', function () {
	gulp.src('assets/less/app.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 5 versions', 'ff >= 24'],
			cascade: false
		}))
		.pipe(minifyCSS({
			keepBreaks: false,
			keepSpecialComments: false,
			benchmark: false,
			debug: false
		}))
		.pipe(gulp.dest('../design-okna.brainmaze.net/css'))
		.pipe(gulp.dest('public/css'));
});
