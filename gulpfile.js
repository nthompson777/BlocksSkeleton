var gulp = require('gulp');

// Include Our Plugins
    // debug = require('gulp-debug'),  // uncomment plugin when debugging 
    bowerInstall = require('gulp-bower2'),
    mainBowerFiles = require('main-bower-files'),
    bowerNormalizer = require('gulp-bower-normalize'),
    sass = require('gulp-sass'),
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

// BLOCKS Main Task for compiling, minifying (automatically to each institution) - simply run 'gulp start' via CLI
// For each BLOCK all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
require('require-dir')('build/tasks');

gulp.task('start', ['watch', 'styles-copy', 'blocks-watch', 'blocks-minify']);

// Sass/CSS Files - the folder, files to look for, and destination
var paths = {
  styles: {
    src: '../../../../Content/global',
    skeletonTempCSS: '../../../../Content/Blocks/Apps/BlocksSkeleton/institutions/ifa/dist/main.css',
    blocks: '../../../../Content/Blocks/**/*/*.scss',
    // directories to exclude (from compiling, etc.)
    exclude: ['!../../../../Content/global/scss_converted/**/*', '!../../../../Components/**/*'],
    dest: '../../../../Content/global'
  }
};

// Copy compiled CSS to BLOCKS Skeleton folder for Debugging (relative to compiled CSS file)
gulp.task('styles-copy', function () {
  return gulp.src(paths.styles.skeletonTempCSS)
  .pipe(gulp.dest('./styles'));
});


// Watch for changes to our Sass files on Blocks Pages - Run task seperately/independently!!!
gulp.task('blocks-watch', function () {
  gulp.watch(paths.styles.blocks)
  .on('change', function () {
    return gulp.src(paths.styles.blocks) // Gets all files ending with .scss in content/global
      .pipe(sourcemaps.init())
        // Keep the outputStyle as 'nested' otherwise line #'s get thrown off in sourcemaps debugging 
        .pipe(sass({ outputStyle: 'nested', precision: 6 }).on('error', sass.logError))  // sourceComments: 'map',
        .pipe(sourcemaps.write())  // Generate inline sourcemap file for debugging Sass files, add '.' for ext
       // Output to same destination as src
    .pipe(gulp.dest(function (file) {
      return file.base;
    }));
  });
});

// BLOCKS -- Run PostCSS, minify, and then copy to 'dist' folder of each institution
gulp.task('blocks-minify', function () {
  gulp.watch('../../../../Content/Blocks/Apps/*/institutions/*/dist/main.css')
  .on('change', function (file) {
    var destPath_blocks = file.path.replace('main.css', '.'),
        // PostCSS Plugins for Production CSS (PostCSS tasks must be AFTER the Sass task)
        processorsProd = [
          autoprefixer({ browsers: ['last 2 versions', 'not ie < 11'] }),
          mqpacker(),
        ];

    gulp.src(file.path)
      .pipe(postcss(processorsProd))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS({ debug: true, rebase: false }, function (details) {
        console.log('---- Minify BLOCKS CSS for Prod ----');
        console.log(file.path + ': ');
        console.log(details.stats.originalSize + ' original size' + ' --- '
        + details.stats.minifiedSize + ' minified size.'); 
      }))
    .pipe(gulp.dest(destPath_blocks));
  });
});

// Stylelint Task for analyzing our Sass files by running through Stylelint & produces report 
gulp.task('analyze-scss', function () {
  return gulp.src(paths.styles.lint)
    .pipe(postcss([
      stylelint(),
      reporter()],
      {syntax: syntax_scss}
    ));
});

// SAVE the Commented Out Task Directly Below!!!! Autoprefixer Check - 
// Uncomment & run gulp via CLI to see the browser list, rules, selectors, & properties covered 
// var info = autoprefixer({ browsers: ['last 3 versions', 'not ie < 11'] }).info();
// console.log(info);