module.exports = function(grunt) {
    'use strict';

    var srcDir = './src';
    var distDir = './dist';
    var distJsDir = distDir + '/js';
    var distJsLibDir = distJsDir + '/lib';
    // var distJsDir = distDir + '/js';
    // var distJsLibDir = distJsDir + '/lib';
    //var srcCssDir = srcDir + '/css';

    grunt.loadTasks('./grunt_tasks');
    grunt.loadNpmTasks('grunt-typescript-using-tsconfig');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-http-server');

    // Project configuration.
    grunt.initConfig({
        'typescriptUsingTsConfig': {
            main: {
                options: {
                    rootDir: "./",
                    filesGlob: [
                        "./src/**/*.ts"
                    ]
                }
            }
        },
        'ts-index': {
            main: {
                options: {
                    tsconfig: './tsconfig.json',
                    sourceDir: srcDir + '/ts',
                    targetDir: distDir + '/js',
                    exclude: ['app/main', 'lib/**/*']
                }
            }
        },
        sync: {
            main: {
                files: [{
                    cwd: srcDir,
                    src: [
                        '**', /* Include everything */
                        '!ts/**' /* but exclude ts files */
                    ],
                    dest: distDir
                }],
                options: {
                    //force: true
                },
                //pretend: true, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
                verbose: false //true // Display log messages when copying files
            }
        },
        clean: {
            options: {
                force: true
            },
            main: [distDir + '/**']
        },
        copy: {
            main: {
                files: [
                    /* JS LIB */
                    {src: 'bower_components/angular/angular.js', dest: distJsLibDir + '/angular.js'},
                    {src: 'bower_components/angular-ui-router/release/angular-ui-router.js', dest: distJsLibDir + '/angular-ui-router.js'},
                    {src: 'bower_components/lodash/lodash.js', dest: distJsLibDir + '/lodash.js'},
                    {src: 'bower_components/requirejs/require.js', dest: distJsLibDir + '/require.js'},
                    {src: 'bower_components/reflect-metadata/Reflect.js', dest: distJsLibDir + '/Reflect.js'}
                ]
            }
        },
        'http-server': {
            'dev': {
                root: './dist',
                port: 8000,
                host: "localhost",
                cache: -1,
                showDir : false,
                autoIndex: true
            }
        }
    });

    grunt.registerTask('build:sync', ['sync:main', 'typescriptUsingTsConfig', 'ts-index:main']);
    grunt.registerTask('build:dev', ['clean:main', 'copy:main', 'build:sync']);
    grunt.registerTask('default', ['build:dev']);
    // grunt.registerTask('build:dev', ['clean:dev', 'index-generator:dev', 'test-task', 'copy:dev']);
    // grunt.registerTask('build:release', ['build:dev', 'clean:main', 'requirejs', 'copy:main']);
};
