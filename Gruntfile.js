'use strict';
/**
 * @link https://github.com/jsoverson/grunt-env
 * @link https://github.com/pghalliday/grunt-mocha-test
 * @link https://github.com/gruntjs/grunt-contrib-watch
 * @link https://github.com/stephenplusplus/grunt-wiredep
 *
 * There is a bug in the max number of watches for Grunt.
 * http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc
 */

module.exports = function(grunt) {
    grunt.initConfig({
        env: {
            test: {
                NODE_ENV: 'test',
                PORT: 9000
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: ['mocha.conf.js'],
                    timeout: 5000, // Set default mocha spec timeout
                    clearRequireCache: true // "'mocha' loads your test using require resulting in them being added to the require cache"
                },
                src: ['server/**/*.spec.js']
            }
        },
        watch: {
            //js: {
            //    options: {
            //        spawn: false
            //    },
            //    files: ['{server,client}/**/*.js'],
            //    tasks: [ 'karma', 'test']
            //},
            wiredep: {
                files: ['client/public/bower_components/**'],
                tasks: ['wiredep']
            },
            sass: {
                options: {
                    spawn: true
                },
                files: ['client/**/*.scss'],
                tasks: ['sass']
            },
            injector: {
                files: [['client/public/scripts/**','!client/public/srcipts/app.js', 'client/public/css/**'], ['client/public/scripts/app.js']],
                tasks: ['injector']
            }
        },
        wiredep: {
            target: {
                src: ['client/index.html'],
                exclude: ['client/public/bower_components/angular-mocks/'],
                ignorePath: 'public/'
            }
        },
        ngtemplates: {
            simplejobs: {
                cwd: 'client/public',
                src: '**/*.tpl.html',
                dest: '.tmp/template.js',
                options: {
                    usemin: 'js/app.js',
                    htmlmin: {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true, // Only if you don't use comment directives!
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }
            }
        },
        injector: {
            options: {
                addRootSlash: false,
                ignorePath: 'client/public/'
            },
            dist: {
                files: {
                    'client/index.html': ['client/public/scripts/**/*.js', 'client/public/css/**/*.css']
                }
            }
        },
        // https://github.com/gruntjs/grunt-contrib-sass#compile-files-in-a-directory
        // http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
        sass: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'client/',
                    src: [ 'sass/**/*.scss'],
                    dest: 'client/public/css',
                    ext: '.css'
                }, {
                    expand: true,
                    cwd: 'client/public/',
                    src: [ 'scripts/**/*.scss'],
                    dest: 'client/public/css',
                    ext: '.css'
                }]
            }
        },
        useminPrepare: {
            html: 'client/index.html',
            options: {
                dest: 'build/public',
                root: 'client/public'
            }
        },
        usemin: {
            options: {},
            html: ['build/index.html']
        },
        copy: {
            'index.html': {
                src: 'client/index.html',
                dest: 'build/index.html'
            },
            'assets': {
                cwd: 'client/public/assets',
                src: '**/*',
                dest: 'build/public/assets',
                expand: true
            },
            'favicon': {
                src: 'client/public/favicon.ico',
                dest: 'build/public/favicon.ico'
            },
            'robots': {
                src: 'client/public/robots.txt',
                dest: 'build/public/robots.txt'
            },
            'sitemap': {
                src: 'client/public/sitemap.xml',
                dest: 'build/public/sitemap.xml'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['env:test', 'mochaTest']);

    grunt.registerTask('build', [
        'sass',
        'copy',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'cssmin',
        'uglify',
        'usemin'
    ]);
};