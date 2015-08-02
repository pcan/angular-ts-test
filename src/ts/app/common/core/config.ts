
import {RunBlock, ConfigBlock} from './decorators';

export interface AppRootScope extends ng.IRootScopeService {
    $state: ng.ui.IStateService;
    $stateParams: ng.ui.IStateParamsService;
}

@RunBlock()
class MainRun {

    constructor($rootScope: AppRootScope, $state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on("$stateChangeError", console.log.bind(console));
        $rootScope.$on('$stateChangeStart', function(evt, to, params: ng.ui.IStateOptions) {
            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params);
            }
        });
    }

}

@ConfigBlock()
class MainConfig {

    constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $compileProvider: ng.ICompileProvider) {
        $compileProvider.debugInfoEnabled(false);
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state({
                name: 'home',
                url: '/home',
                templateUrl: 'views/home.html'
            })
            .state({
                name:'app',
                url: '/app',
                templateUrl: 'views/app.html'
            });
    }

}
