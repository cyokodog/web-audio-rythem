var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var $ = loadPlugins();
var browser = require("browser-sync");

function plumberWithNotify() {
  return $.plumber({errorHandler: $.notify.onError("<%= error.message %>")});
}

gulp.task("server", function() {
	browser({
	server: {
		baseDir: "./"
	}
	});
});

gulp.task("sass", function() {
//	gulp.src("sass/**/*scss")
	gulp.src(['sass/style.scss','sass/parts.scss'])
	.pipe(plumberWithNotify())
	.pipe($.frontnote({
		css: '../css/style.css'
	}))
	.pipe($.sass())
	.pipe($.autoprefixer())
	.pipe(gulp.dest("./css"))
	.pipe($.concat('all.css'))
	.pipe(gulp.dest("./css"))
	.pipe($.minifyCss())
	.pipe(gulp.dest("./css/min"))
	.pipe(browser.reload({
		stream:true
	}));
});

gulp.task("js", function() {
//	gulp.src(["js/**/*.js","!js/min/**/*.js"])
	gulp.src([
		'js/util.js',
		'js/vender_prefix.js',
		'js/audio_helper.js',
		'js/audio.js',
		'js/recorder.js',
		'js/app.js',
		'js/app.view.js',
		'js/index.js',
		'!js/min/**/*.js'
	])
	.pipe(plumberWithNotify())
	.pipe($.uglify())
	.pipe($.concat('all.js'))
	.pipe(gulp.dest("./js/min"))
	.pipe(browser.reload({
		stream:true
	}));
});

gulp.task("html", function() {
	gulp.src(["**/*.html",])
	.pipe(plumberWithNotify())
	.pipe(browser.reload({
		stream:true
	}));
});

gulp.task("default", ['server'], function() {
	gulp.watch(["js/**/*.js","!js/min/**/*.js"],["js"]);
	gulp.watch("sass/**/*.scss",["sass"]);
	gulp.watch("**/*.html",["html"]);
});