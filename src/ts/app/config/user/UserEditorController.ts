import {Views, Inject, ValueResolver} from '../../common/core/decorators';
import {User, UserService} from './UserService';

interface Model { user: User; }
interface Scope extends ng.IScope { model: Model }
interface StateParams extends ng.ui.IStateParamsService { userId: string }

@Views([
    { name: 'app.config.user.new', url: '/new', templateUrl: 'views/config/user/userEdit.html' },
    { name: 'app.config.user.edit', url: '/:userId', templateUrl: 'views/config/user/userEdit.html' }
])
export class UserEditorController {

    model: Model;
    $state: ng.ui.IStateService;
    userService: UserService;

    constructor($scope: Scope, $state: ng.ui.IStateService, userService: UserService, @Inject('currentUser') currentUser: User) {
        $scope.model = this.model = {
            user: currentUser
        };
        this.userService = userService;
        this.$state = $state;
    }

    save() {
        this.userService.save(this.model.user);
        this.$state.go("^", {}, { reload: true });
    }

    @ValueResolver('currentUser')
    static resolveCurrentUser(userService: UserService, $stateParams: StateParams): User | ng.IPromise<User> {
        if (!_.isEmpty($stateParams.userId)) {
            return userService.getById(_.parseInt($stateParams.userId));
        }
        return userService.newUser();
    }

}
