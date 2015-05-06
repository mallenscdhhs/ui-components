var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var babelify = require('babelify');
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


gulp.task('build:components', function(){
  var externals = ['lodash', 'react', 'fluxify', 'immutable'];
  return browserify(['./src/main.js'], {extensions: ['.jsx']})
    .external(externals)
    .transform(babelify)
    .bundle()
    .pipe(source('scdhhs-ui-components.js'))
    .pipe(gulp.dest('./dist'));
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


gulp.task('assets', ['less:compile', 'copy:fonts','copy:images']);

gulp.task('build', ['clean'], function(){
  gulp.start('build:components');
  gulp.start('assets');
});
