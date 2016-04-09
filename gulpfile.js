(function(){
    'use strict';

    var gulp          = require('gulp'),
        jshint        = require('gulp-jshint'),
        stylish       = require('jshint-stylish'),
        plumber       = require('gulp-plumber'),
        sourcemaps    = require('gulp-sourcemaps'),
        browserify    = require('browserify'),
        fs            = require('fs'),
        babel         = require('babelify'),
        buffer        = require('vinyl-buffer'),
        jade          = require('gulp-jade'),
        stylus        = require('gulp-stylus'),
        nib           = require('nib'),
        jeet          = require('jeet'),
        rupture       = require('rupture'),
        typographic   = require('typographic'),
        prefix        = require('gulp-autoprefixer'),
        sourceStream  = require('vinyl-source-stream');

        var paths = {
            src : {
                jade: 'index.jade',
                stylus: 'styl/**/*.styl',
                js: 'js/script.js',
            },
            dest : {
                html: './',
                css: './dist/',
                js: './dist/'
            }
        };

    gulp.task('es2015', function(){
        return  browserify({ debug: true })
            .transform('babelify', {
                presets: [ 'es2015' ]
            })
            .require(paths.src.js, {
                entry: true
            })
            .bundle()
                .on("error", function (err) {
                    console.log("Error: " + err.message);
                })
                .pipe(fs.createWriteStream('dist/scripts.js'));
    });


    gulp.task('jshint', function(){
        return gulp.src( paths.src.js )
            .pipe( plumber() )
            .pipe( jshint() )
            .pipe( jshint.reporter(
                stylish
            ));
    });


    gulp.task('autoprefixer', function(){
        return gulp.src(paths.dest.css )
            .pipe( plumber() )
            .pipe( prefix([
                'last 2 versions',
                '> 1%',
                'ie 10'
            ]))
            .pipe( gulp.dest(paths.dest.css) );
    });


    gulp.task( 'jade', function() {
        return gulp.src( 'index.jade' )
            .pipe( plumber() )
            .pipe( jade({
                pretty: true
            }))
            .pipe( gulp.dest( paths.dest.html ) );
    });


    gulp.task('stylus', function(){
        return gulp.src( paths.src.stylus )
            .pipe( plumber() )
            .pipe( sourcemaps.init() )
            .pipe( stylus({

            paths: [
                'node_modules',
                paths.src.stylus
            ],

            import: [
                'jeet/stylus/jeet',
                'nib',
                'rupture/rupture',
            ],

            use: [
                nib(),
                typographic(),
                rupture(),
                jeet()
            ],

            'include css': true

        }))
            .pipe( sourcemaps.write('.') )
            .pipe( gulp.dest( paths.dest.css) );
    });


    gulp.task('watch', function() {
        gulp.watch( paths.src.jade, [
            'jade'
        ]);

        gulp.watch( paths.src.stylus, [
            'stylus',
            'autoprefixer'
        ]);

        gulp.watch( paths.src.js, [
            'jshint'
        ]);

        gulp.watch( paths.src.js, [
            'es2015'
        ]);
    });


    gulp.task('default', [
        'watch',
        'es2015'
    ]);
}());
