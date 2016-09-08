// generated on 2016-06-07 using generator-chrome-extension 0.5.6
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';
import brow from 'browserify';
import source from 'vinyl-source-stream';

const $ = gulpLoadPlugins();

gulp.task('browserify', function(){
  brow({
    entries: 'app/scripts.babel/contentscript/contentscript.js',
    debug: true
  })
  .transform("babelify", {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('bundledContentscript.js'))
  .pipe(gulp.dest('app/scripts'))
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    '!app/scripts.babel',
    '!app/*.json',
    '!app/*.html',
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src('app/scripts.babel/**/*.js')
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe($.eslint({
          parserOptions: {
            "ecmaFeatures": {
               "jsx": true
             }
          }
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe($.eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        // .pipe($.eslint.failAfterError());
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('html',  () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({removeComments: true, collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: true,
      background: {
        target: 'scripts/background.js',
        exclude: [
          'scripts/chromereload.js'
        ]
      }
  }))
  .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
  .pipe($.if('*.js', $.sourcemaps.init()))
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.js', $.sourcemaps.write('.')))
  .pipe(gulp.dest('dist'));
});

gulp.task('babel', () => {
  return gulp.src('app/scripts.babel/*.js')
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('app/scripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['lint', 'babel', 'html','browserify'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts.babel/contentscript/**/*.js', ['lint', 'browserify']);
  gulp.watch('app/scripts.babel/*.js', ['lint','babel']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', function () {
  var manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
      .pipe($.zip('SpeechCoach-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('build', (cb) => {
  runSequence(
    'lint', 'babel', 'chromeManifest',
    ['html', 'images', 'extras'],
    'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});
