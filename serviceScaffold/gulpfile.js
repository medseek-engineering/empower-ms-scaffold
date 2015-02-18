'use strict';

var gulp = require('gulp');

gulp.task('start', function() {
    require('./{%=name%}.js');
});

gulp.task('start-watch', function() {
    var gulpNodemon = require('gulp-nodemon');
    gulpNodemon(getOptions({
        script: '{%=name%}',
        ext: 'html js',
        ignore: [
        ]
    }));
});

gulp.task('test', function() {
    var gulpMocha = require('gulp-mocha');
    var gulpUtil = require('gulp-util');
    var options = getOptions({
        reporter: 'spec',
        timeout: undefined
    });
    return gulp.src(['test/**/*.test.js'], { read: false })
        .pipe(gulpMocha(options))
        .on('error', gulpUtil.log);
});

gulp.task('test-watch', function() {
    gulp.watch(['**/*'], ['test']);
});

function getOptions(defaults) {
    var args = process.argv[0] == 'node' ? process.argv.slice(3) : process.argv.slice(2);
    var minimist = require('minimist');
    return minimist(args, {
        default: defaults
    });
}
