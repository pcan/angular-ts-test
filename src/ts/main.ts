declare var require: any;
(function() {
    'use strict';

    require.config({
        paths: {
            'angular': 'lib/angular',
            'ui-router': 'lib/angular-ui-router',
            'lodash': 'lib/lodash',
            'reflect': 'lib/Reflect',
            'ts-index': 'index'
        },
        shim: {
            'angular': {
                exports: 'angular'
            },
            'ui-router': {
                deps: ['angular']
            },
            'ts-index': {
                deps: ['reflect', 'angular', 'ui-router', 'lodash']
            }
        }
    });

    require(['ts-index'], function() {
        var appmodule = require('app/common/core/module');
        var appName: string = appmodule.appName;
        var htmlElement = document.getElementsByTagName('html')[0];
        angular.bootstrap(htmlElement, [appName], { strictDi: true });
    });

} ());
