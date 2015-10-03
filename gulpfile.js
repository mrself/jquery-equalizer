var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	watchify = require('watchify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	prettyHrtime = require('pretty-hrtime');

var src = './build.js',
	npmFile = 'index.js',
	appFile = 'app.js';

gulp.task('build', function() {
	return gulp.src('./src.js')
		.pipe(uglify().on('error', function(e) {
			gutil.log(gutil.colors.red(e));
			return this.end();
		}))
		.pipe(rename('./build.js'))
		.pipe(gulp.dest('./'));
});
gulp.task('watchify', function() {
	var watcher = watchify(browserify({
		cache: {}, packageCache: {}, fullPaths: false,
		entries: './app-src.js',
		dest: appFile
	}));
	var startTime;
	function bundle() {
		startTime = process.hrtime();
		gutil.log('Bundling', gutil.colors.green(appFile) + '...');
		return watcher
			.bundle()
			.pipe(source(appFile))
			.pipe(gulp.dest('./'))
			.on('end', function() {
				var taskTime = process.hrtime(startTime);
				var prettyTime = prettyHrtime(taskTime);
				gutil.log('Bundled', gutil.colors.green(appFile), 'in', gutil.colors.magenta(prettyTime));
			});
	}
	watcher.on('update', bundle);
	return bundle();

});
gulp.task('watch', function() {
	watch('./src.js', function() {
		gulp.start('build');
	});
});
gulp.task('default', ['build', 'watch', 'watchify']);