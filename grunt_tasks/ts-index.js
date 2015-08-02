var _ = require('lodash');

module.exports = function(grunt) {
    'use strict';

    var COMMENT = '/* This file is created by the ts-index Grunt task. Do not edit it. */\n';

    var taskName = 'ts-index';

    grunt.registerMultiTask(taskName, 'An index builder for Typescript Project.', function() {

        var options = this.options({
            exclude: []
        });

        checkOptions(options);
        var tsconfig = grunt.file.readJSON(options.tsconfig);

        var files = _.chain(tsconfig.files)
            .filter(function(file){
                return file.indexOf(options.sourceDir) >= 0;
            })
            .map(function(file) {
                return file.replace(options.sourceDir, '').replace('.ts', '');
            })
            .value();

        var content = createIndexContent(files, options.exclude);
        grunt.file.write(options.targetDir + 'index.js', content);

        grunt.log.ok('Index.js created.');

    });


    function createIndexContent(files, exclude) {
        var content = COMMENT + 'define([\n';
        _.forEach(files, function(file, i) {
            if(!grunt.file.isMatch(exclude, file)) {
                content += '\t\'' + file + '\'' + (i === files.length - 1 ? '' : ',') + '\n' ;
            }
        });
        content += '], function(){});';
        return content;
    }

    function checkOptions(options) {
        if (!options.tsconfig || !grunt.file.isFile(options.tsconfig)) {
            grunt.fail.fatal("Please specify the tsconfig option for ts-index task.");
        }

        if (!options.sourceDir) {
            grunt.fail.fatal("Please specify the sourceDir option for ts-index task.");
        }
        options.sourceDir = stripTrailingSlash(options.sourceDir) + '/';

        if (!options.targetDir) {
            grunt.fail.fatal("Please specify the targetDir option for ts-index task.");
        }
        options.targetDir = stripTrailingSlash(options.targetDir) + '/';
    }

    function stripTrailingSlash(str) {
        if (str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }
};
