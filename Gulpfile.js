const gulp = require('gulp');
const babel = require('gulp-babel');
const runsequence = require('run-sequence');
const del = require('del');


// ============
//	Gulp tasks
// ============

// Default task
gulp.task('default', function() {
	runsequence('clean', 'transpile', 'watch');
});

gulp.task('build', function() {
	runsequence('clean', 'transpile');
});


// ===========
// 	Sub tasks
// ===========

// Transpile source code
gulp.task('transpile', function() {
	gulp.src('src/server/**/*.js')
	.pipe(babel())
	.pipe(gulp.dest('dist/server'));
});

// Watch files
gulp.task('watch', function() {
	gulp.watch('src/server/**/*.js', ['transpile']);
});

// Clean dist/server folder
gulp.task('clean', function() {
	return del([
		'dist/server/'
	]);
});
