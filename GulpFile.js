var gulp = require('gulp');
var jsHint = require('gulp-jshint');
var del = require('del');
var reactify = require('reactify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;

gulp.task('hint', function(){
  return gulp.src(['./src/**/*.js', './test/**/*.js']).pipe(jsHint());
});

gulp.task('clean', function(done){
  return del(['dist/'], done);
});

gulp.task('clean-specs', function(done){
  return del(['test/lib/specs.js'], done);
});

gulp.task('test', ['hint'], function(done){
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('compile', ['clean'], function(){
  browserify({entries: ['./node_modules/components'], standalone: 'components'})
    .transform(reactify)
    .bundle()
    .pipe(source('components.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('specs', ['hint'], function(){
  browserify(['./test/unit/index.js'])
    .transform(reactify)
    .bundle()
    .pipe(source('specs.js'))
    .pipe(gulp.dest('./test/lib'));
});


gulp.task('watch', function(){
  gulp.watch(['test/**/*-spec.js'], ['specs']);
  gulp.watch(['node_modules/components/**/*.jsx'], ['compile']);
});
