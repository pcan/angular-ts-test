import {ConfigBlock} from '../../common/core/decorators';

@ConfigBlock()
class StateConfig {

    constructor($stateProvider: ng.ui.IStateProvider) {
        var configState: ng.ui.IState = {
            name:'app.config.company',
            url: '/config',
            templateUrl: 'views/config/company/companyMain.html'
        }
        $stateProvider.state(configState);
    }

}
