import * as gulp from 'gulp';
import * as sass from 'gulp-sass';
import * as cleanCSS from 'gulp-clean-css';
import * as concat from 'gulp-concat';
import * as rename from 'gulp-rename';
import * as sourcemaps from 'gulp-sourcemaps';
import * as uglify from 'gulp-uglify';
import * as streamQueue from 'streamqueue';
import * as autoprefixer from 'autoprefixer';
import * as mqpacker from 'css-mqpacker';
import * as stylelint from 'stylelint';
import * as syntax_scss from 'stylelint';
import * as reporter from 'postcss-reporter';
import * as postcss from 'gulp-postcss';
import * as flatten from 'gulp-flatten';
import * as project from '../aurelia.json';
import {build} from 'aurelia-cli';


// Sass/CSS Files - the folder, files to look for, and destination
var paths = {
  styles: {
    src: '../../../../../../Content/global',
    skeletonTempCSS: '../../../../../../Content/Blocks/Apps/BlocksSkeleton/institutions/ifa/dist/main.css',
    blocks: '../../../../../../Content/Blocks/**/*/*.scss',
    // directories to exclude (from compiling, etc.)
    exclude: ['!../../../../../../Content/global/scss_converted/**/*', '!../../../../Components/**/*'],
    dest: '../../../../../../Content/global'
  }
};

export default function processSCSS() {
	return gulp.src(project.cssProcessor.blocks)
	//return gulp.watch(paths.styles.blocks)
  .on('change', function () {
    return gulp.src(project.cssProcessor.blocks) // Gets all files ending with .scss in content/global
      .pipe(sourcemaps.init())
        // Keep the outputStyle as 'nested' otherwise line #'s get thrown off in sourcemaps debugging 
        .pipe(sass({ outputStyle: 'nested', precision: 6 }).on('error', sass.logError))  // sourceComments: 'map',
        .pipe(sourcemaps.write())  // Generate inline sourcemap file for debugging Sass files, add '.' for ext
        .pipe(build.bundle())
      // Output to same destination as src
			.pipe(gulp.dest(function (file) {
				return file.base;
			}));
		},
		

	);
};