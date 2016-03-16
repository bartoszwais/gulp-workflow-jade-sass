// Modules & Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
//var myth = require('gulp-myth');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade'); // Added
var connect = require('connect'); // Added
var serve = require('serve-static'); // Added
var browsersync = require('browser-sync'); // Added
var browserify = require('browserify'); // Added
var source = require('vinyl-source-stream'); // Added
var plumber = require('gulp-plumber'); // Added
var beeper = require('beeper'); // Added
var del = require('del'); // Added
var sourcemaps = require('gulp-sourcemaps') // Added

 // Error Helper
function onError(err) {
    beeper();
    console.log(err);
}
// Clean dist directory
gulp.task('clean', function (cb) {
  return del(['dist'],cb);
});
// Styles Task
gulp.task('styles', function() {
    var scssFiles = ['src/css/normalize.scss', 'src/css/*.scss'];
       return gulp.src(scssFiles)
           .pipe(plumber({
               errorHandler: onError
           }))
           .pipe(concat('all.css'))
           .pipe(sass())
           .pipe(gulp.dest('dist'));
});
// Scripts Task
gulp.task('scripts', function() {
    gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('all.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(sourcemaps.write('dist/maps'))
        .pipe(gulp.dest('dist'));
});

// Images Task
gulp.task('images', function() {
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

// Server task
gulp.task('server', function() {
    return connect().use(serve(__dirname))
        .listen(8080)
        .on('listening', function() {
                console.log('Server Running: View at http://localhost:8080');
        });
    });

// Browser sync task
gulp.task('browsersync', function(cb) {
    return browsersync({
        server: {
            baseDir:'./dist/'
        }
    }, cb);
});

// Browserify task
gulp.task('browserify', function() {
     return browserify('./src/js/src.js')
       .bundle()
       .pipe(source('bundle.js'))
       .pipe(gulp.dest('dist'));
});

gulp.task('jade', function() {
    return gulp.src('src/templates/**/*.jade')
        .pipe(jade()) // pip to jade plugin
        .pipe(gulp.dest('dist')); // tell gulp our output folder
});

// Watch Task
   gulp.task('watch', function() {
       gulp.watch('src/css/*.scss', gulp.series('styles', browsersync.reload));
       gulp.watch('src/js/*.js', gulp.series('scripts', browsersync.reload));
       gulp.watch('src/img/*', gulp.series('images', browsersync.reload));
       gulp.watch('src/templates/*.jade', gulp.series('jade', browsersync.reload));
});


// Default Task
gulp.task('default', gulp.parallel( 'styles', 'scripts', 'images','jade', 'server','browsersync', 'watch'));
