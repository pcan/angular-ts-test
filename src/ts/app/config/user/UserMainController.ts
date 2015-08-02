import {View, Inject, ValueResolver} from '../../common/core/decorators';
import {User, UserService} from './UserService';

interface Status { currentPage: number; pageSize: number; }
interface Model { users: User[]; }
interface Scope extends ng.IScope { model: Model; status: Status; }

@View({
    name: 'app.config.user', url: '/user', templateUrl: 'views/config/user/userMain.html'
})
export class UserMainController {

    private model: Model;
    private status: Status;
    private $state: ng.ui.IStateService;
    private userService: UserService;

    constructor($scope: Scope, $state: ng.ui.IStateService, userService: UserService, @Inject('allUsers') allUsers: User[]) {
        this.$state = $state;
        this.userService = userService;

        this.model = $scope.model = {
            users: allUsers
        };

        this.status = $scope.status = {
            currentPage: 1,
            pageSize: 4
        };
    }

    deleteUser(user: User): void {
        this.userService.deleteUser(user.id);
        this.$state.go(this.$state.current.name, {}, { reload: true });
    };


    pages(): Array<number> {
        var pageCount = Math.ceil(this.model.users.length / this.status.pageSize);
        var pages = [];
        for (var i = 1; i <= pageCount; i++) {
            pages[i] = i;
        }
        return pages;
    };

    @ValueResolver('allUsers')
    static resolveAllUsers(userService: UserService): ng.IPromise<User[]> {
        return userService.getUsers();
    }

}
