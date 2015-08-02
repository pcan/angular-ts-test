import {ConfigBlock} from '../common/core/decorators';

@ConfigBlock()
class StateConfig {

    constructor($stateProvider: ng.ui.IStateProvider) {
        var configState: RedirectingState = {
            name:'app.config',
            url: '/config',
            templateUrl: 'views/config/configMain.html',
            redirectTo: 'app.config.user'
        }        
        $stateProvider.state(configState);
    }

}
