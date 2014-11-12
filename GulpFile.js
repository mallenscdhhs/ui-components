var fs = require('fs');
var gulp = require('gulp');
var jsHint = require('gulp-jshint');
var del = require('del');
var reactify = require('reactify');
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;
var wrap = require('gulp-wrap-js');
var pkg = require('./package.json');
var copy = require('gulp-copy');
var _ = require('underscore');
var requirejs = require('gulp-requirejs-simple');


gulp.task('clean', function(done){
  return del(['dist/'], done);
});

gulp.task('clean-specs', function(done){
  return del(['test/lib/specs.js'], done);
});

gulp.task('hint', function(){
  return gulp.src(['./src/**/*.js', './src/**/*.jsx', './test/**/*.js']).pipe(jsHint());
});


gulp.task('test', ['hint'], function(done){
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

/**
 * Build all components by transforming JSX to JS, and then
 * wrapping the code for AMD and pushing all assets to their
 * respective folders. We create assets for AMD, CJS and browser
 * global environments.
 */
gulp.task('build:amd', ['clean', 'hint'], function(){
  return gulp.src(['./src/**/*.jsx', './src/*.js'])
    .pipe(react())
    .pipe(wrap('define(function(require, exports, module){%= body %});'))
    .pipe(gulp.dest('./dist/amd'));
});

gulp.task('build:cjs', ['clean', 'hint'], function(){
  return gulp.src(['./src/**/*.jsx', './src/*.js'])
    .pipe(react())
    .pipe(gulp.dest('./dist/cjs'));
});

gulp.task('build:copy', ['build:amd', 'build:cjs'], function(){
  return gulp.src(['./src/amd/*', './src/cjs/*'])
    .pipe(copy('./dist', {prefix: 1}));
});

gulp.task('build', ['clean', 'hint', 'build:amd', 'build:cjs', 'build:copy']);

/**
  * Builds a browser-based version of the component library. This will
  * attach the "Components" namespace to the window object so that you
  * can reference components like: Components.Page. You will need to supply
  * your own version of React and Underscore.
  */
gulp.task('build:browser', requirejs({
  baseUrl: "dist/amd",
  nodeRequire: require,
  paths: {
    "ui-components": "./index",
    almond: "../../node_modules/almond/almond",
    underscore: "../../node_modules/underscore/underscore",
    superagent: "../../node_modules/superagent/superagent",
    marked: "../../node_modules/marked/lib/marked"
  },
  packages: [
    { name: 'react/addons', location: '../../node_modules/react', main: './addons' }
  ],
  include: ["almond", "ui-components"],
  exclude: ["react/addons"],
  out: "dist/ui-components.js",
  cjsTranslate: true,
  wrap: {
    startFile: "src/amd/wrap.start",
    endFile: "src/amd/wrap.end"
  },
  rawText: {
    'react/addons': 'define({});'
  },
  optimize: "none"
}));

/**
 * Build a browserified version of the library for use in the test/specs.html
 * file. This page is a browser-based spec runner that uses Jasmine.
 */
gulp.task('specs', ['hint'], function(){
  fs.readdir('./test/unit', function(err, files){
    browserify(files.map(function(file){ return './test/unit/'+file; }))
      .transform(reactify)
      .bundle()
      .pipe(source('specs.js'))
      .pipe(gulp.dest('./test/lib'));
  });
});

gulp.task('watch', function(){
  gulp.watch(['test/**/*-spec.js'], ['specs']);
  gulp.watch(['src/**/*.jsx'], ['build']);
  gulp.watch(['dist/amd/index.js'], ['build:browser']);
});
