import {Directive, Controller} from '../../common/core/decorators';
import {User} from './UserService';

var template = `
        <span data-ng-class="{'text-red': user.level > 3}">
            <small data-ng-repeat="i in ctrl.emptyArray()">&#9733;&nbsp;</small>
        </span>
`;

interface Scope extends ng.IScope {
    user: User;
}

@Controller()
class UserRankDirectiveController {
    user: User;

    constructor($scope: Scope) {
        this.user = $scope.user;
    }

    emptyArray() {
        var array = [];
        for(var i = 0; i < this.user.level; i++) array[i] = i;
        return array;
    };

}


@Directive('userRank')
export class UserRankDirective implements ng.IDirective {

    controller = UserRankDirectiveController;
    restrict = 'A';
    template = template;
    //controllerAs: 'ctrl', set as default
    replace = true;
    scope = {
        user: '=userRank'
    }

    constructor($q: ng.IQService) {
        console.log('Q service in UserRankDirective:', $q);
    }

}
