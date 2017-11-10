
/// <vs SolutionOpened='default, sass' />
// Include gulp

var gulp = require('gulp'),

// Include Our Plugins
    // debug = require('gulp-debug'),  // uncomment plugin when debugging 
    bowerInstall = require('gulp-bower2'),
    mainBowerFiles = require('main-bower-files'),
    bowerNormalizer = require('gulp-bower-normalize'),
    sass = require('gulp-sass'),
    lessToScss = require('gulp-less-to-scss'),
    bless = require('gulp-bless'),
    cleanCSS = require('gulp-clean-css'),
    urlAdjuster = require('gulp-css-url-adjuster'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    streamQueue = require('streamqueue'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    stylelint = require('stylelint'),
    syntax_scss = require('postcss-scss'),
    reporter = require('postcss-reporter'),
    postcss = require('gulp-postcss'),
    flatten = require('gulp-flatten'),

    browserSync = require('browser-sync').create();


// --------------------------------------------------------------------------------------------------------------------------------

// Sass/CSS Files - the folder, files to look for, and destination
var paths = {
  styles: {
    src: './scss/blocks/',
    files: './scss/blocks/*.scss',
    blocksFiles: ['./scss/blocks/global-blocks.css', './blocks/*.html'], // BrowserSync for Blocks
    lint: './Content/global/**/*.scss',
    debug: './Content/global/institutions/*/global.css',
    // directories to exclude (from compiling, etc.)
    exclude: ['!./Content/global/scss_converted/**/*', '!./Components/**/*'],
    dest: './scss/blocks/'
  }
};



// BLOCKS -- Watch for changes to our Sass files on BLOCKS Pages - Run task seperately/independently!!!
// Watch for changes to our Sass files in MGP application
gulp.task('blocks-watch', function () {
  gulp.watch(paths.styles.files)
  .on('change', function () {
    return gulp.src(paths.styles.files) // Gets all files ending with .scss in app/scss
      .pipe(sourcemaps.init())
        // Keep the outputStyle as 'nested' otherwise line #'s get thrown off in sourcemaps debugging
        .pipe(sass({ outputStyle: 'nested', sourceComments: 'map', precision: 6 }).on('error', sass.logError))
        .pipe(urlAdjuster({ prependRelative: '../' }))
      .pipe(sourcemaps.write())  // Generate inline sourcemap file for debugging Sass files, add '.' for ext
      .pipe(gulp.dest(paths.styles.dest));
  });
});

// BLOCKS -- Run PostCSS, minify, and then copy to 'dist' folder
gulp.task('blocks-minify', function () {
  gulp.watch('./scss/blocks/global-blocks.css')
  .on('change', function (file) {
    var destPath_pl = file.path.replace('global-blocks.css', 'dist'),
        // PostCSS Plugins for Production CSS (PostCSS tasks must be AFTER the Sass task)
        processorsProd = [
          autoprefixer({ browsers: ['last 3 versions', 'not ie < 11'] }),
          mqpacker(),
        ];

    gulp.src(file.path)
      .pipe(postcss(processorsProd))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS({ debug: true }, function (details) {
        console.log('---- Compile & Minify BLOCKS CSS for Prod ----');
        console.log(file.path + ': ');
        console.log(details.stats.originalSize + ' original size' + ' --- '
        + details.stats.minifiedSize + ' minified size.');
      }))
    .pipe(gulp.dest(destPath_pl));
  });
});

// BrowserSync: automatically refresh browser(s) & watch for changes 
gulp.task('sync-watch', function () {
  browserSync.init({
    proxy: {
      target: 'http://localhost:8888/blocks',
    },
    port: 8888,
  });
  gulp.watch(paths.styles.blocksFiles)
  .on('change', function () {
    return gulp.src(paths.styles.blocksFiles)
      .pipe(browserSync.reload({ stream: true }));
  });
});

// BLOCKS Task for compiling, minifying, and BrowserSync - run 'gulp blocks' via CLI
gulp.task('blocks', ['blocks-watch', 'blocks-minify', 'sync-watch']);

// --------------------------------------------------------------------------------------------------------------------------------