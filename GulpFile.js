var fs = require('fs');
var gulp = require('gulp');
var jsHint = require('gulp-jshint');
var del = require('del');
var reactify = require('reactify');
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;
var pkg = require('./package.json');
var copy = require('gulp-copy');

gulp.task('clean', function(done){
  return del(['dist/'], done);
});


gulp.task('hint', function(){
  return gulp.src(['./src/**/*.js'])
    .pipe(jsHint())
    .pipe(jsHint.reporter('default'));
});

gulp.task('test', ['hint'], function(done){
  return karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});


gulp.task('transpile', ['clean'], function(){
  return gulp.src(['./src/**/*.jsx', './src/*.js'])
    .pipe(react())
    .pipe(gulp.dest('./dist/build'));
});

gulp.task('build:Components', ['transpile'], function(){
  var lodashPath = require.resolve('lodash');
  var reactPath = require.resolve('react/addons');
  return browserify(['./dist/build/main.js'],{'standalone': 'Components'})
    .exclude(lodashPath)
    .exclude(reactPath)
    .transform(reactify)
    .bundle()
    .pipe(source('Components.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean:build', ['build:Components'], function(done){
  return del(['dist/build'], done);
});

gulp.task('build', ['clean:build']);

gulp.task('release', ['build'], function(){
  var src = './dist/Components.js';
  var dest = './dist/release/'+pkg.version;
  return gulp.src(src).pipe(gulp.dest(dest));
});

gulp.task('specs', ['hint', 'build'], function(){
  fs.readdir('./test/unit', function(err, files){
    browserify(files.map(function(file){ return './test/unit/'+file; }), {extensions: ['.jsx']})
      .transform(reactify)
      .exclude('Components')
      .bundle()
      .pipe(source('specs.js'))
      .pipe(gulp.dest('./test/lib'));
  });
});

gulp.task('watch', function(){
  gulp.watch(['src/*', 'test/unit/*', 'test/fixtures/*'], ['specs']);
});
