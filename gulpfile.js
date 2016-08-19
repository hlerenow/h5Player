var gulp=require("gulp"),
	autorefixer=require("gulp-autoprefixer"),
	clean=require("gulp-clean"),
	rename=require("gulp-rename"),
	minfycss=require("gulp-minify-css"),
	browserSync = require('browser-sync').create(),
	wiredep=require("wiredep").stream,
	jshint=require("gulp-jshint"),
	less=require("gulp-less"),
	plumber = require('gulp-plumber');;


	gulp.task("less",function(){
		return gulp.src("src/less/*.less")
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest("src/styles"));
	});

	gulp.task("style-pre",['less'],function(){
		return gulp.src("src/styles/*.css")
		.pipe(autorefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/css'))
		.pipe(rename({suffix:'.min'}))
		.pipe(minfycss())
		.pipe(gulp.dest('dist/css'));

		console.log("style-ress");
	});


	gulp.task("jshint",function(){
		return gulp.src("src/js/*.js")
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter("default"))
		.pipe(gulp.dest('dist/js'))
	});

	gulp.task("brower",function(){
		return gulp.src("src/index.html")
		.pipe(wiredep({
			optional:"configuration",
			goes:"here"
		}))
		.pipe(gulp.dest("src"));
	});

	gulp.task("bowserSync",function(){
		var files = [
		  '**/*.html',
		  '**/*.css',
		  '**/*.js',
		  '**/*.less'
		  ];
		browserSync.init(files,{
		server: {
		  baseDir: "src",
		  index: "index.html"
		}
		});			
	});

	gulp.task("watch",function(){

		// css 加前缀
		gulp.watch("src/less/*.less",['style-pre']);

		// 
	});

	gulp.task("serve",['style-pre','jshint','brower','watch','bowserSync'])
	gulp.task("default",function(){
		gulp.start("serve");
		console.log("server start");
	});