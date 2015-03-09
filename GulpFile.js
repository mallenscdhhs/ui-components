var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var reactify = require('reactify');
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;
var pkg = require('./package.json');
var copy = require('gulp-copy');
var less = require('gulp-less');
var gutil = require('gulp-util');


gulp.task('clean', function(done){
  return del(['dist/**/*'], done);
});


gulp.task('test', function(done){
  return karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});


gulp.task('less:compile', function(){
  return gulp.src('./src/styles/components.less', {base: 'src/styles'})
    .pipe(less({ paths: ['./node_modules'] }).on('error', gutil.log))
    .pipe(gulp.dest('./dist'));
});


gulp.task('copy:fonts', function(){
  return gulp.src(['./node_modules/bootstrap/fonts/*','./node_modules/react-widgets/dist/fonts/*'])
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy:images', function(){
  return gulp.src(['./node_modules/react-widgets/dist/css/*.gif']).pipe(gulp.dest('./dist/img'));
});

gulp.task('transpile', ['clean'], function(){
  return gulp.src(['./src/**/*.jsx', './src/*.js'])
    .pipe(react())
    .pipe(gulp.dest('./dist/build'));
});


gulp.task('build:Components', ['transpile'], function(){
  var lodashPath = require.resolve('lodash');
  var reactPath = require.resolve('react');
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


gulp.task('release', ['build'], function(){
  var src = './dist/**/*';
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


gulp.task('watch:specs', function(){
  gulp.watch(['src/*', 'test/unit/*', 'test/fixtures/*'], ['specs']);
});


gulp.task('watch:less', function(){
  gulp.watch(['src/styles/**/*.less'], ['less:compile', 'copy:fonts']);
});


gulp.task('build', ['clean:build']);
gulp.task('assets', ['less:compile', 'copy:fonts','copy:images']);
