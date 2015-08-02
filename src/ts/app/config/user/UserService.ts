import {Service} from '../../common/core/decorators';

export interface User {
    id: number,
    name: string,
    level: number
}

@Service()
export class UserService {

    private $q: ng.IQService;
    private $timeout: ng.ITimeoutService;
    private counter = 13;
    private users: User[] = [
        { name: 'John', id: 0, level: 1 },
        { name: 'Mike', id: 2, level: 4 },
        { name: 'Fred', id: 3, level: 3 },
        { name: 'Ted', id: 5, level: 5 },
        { name: 'Frank', id: 6, level: 3 },
        { name: 'Joe', id: 8, level: 2 },
        { name: 'Anthony', id: 9, level: 3 },
        { name: 'Tim', id: 11, level: 5 },
        { name: 'Billy', id: 12, level: 1 }
    ];

    constructor($q: ng.IQService, $timeout: ng.ITimeoutService) {
        this.$q = $q;
        this.$timeout = $timeout;
    }

    getUsers(): ng.IPromise<User[]> {
        var deferred: ng.IDeferred<User[]> = this.$q.defer();
        this.$timeout(() => {
            deferred.resolve(this.users);
        }, 300);
        return deferred.promise;
    };

    getById(id: number): ng.IPromise<User> { //we should have promise here, it's purposely simplified
        var deferred: ng.IDeferred<User> = this.$q.defer();
        this.$timeout(() => {
            var user = _.find(this.users, (user) => {
                return user.id === id;
            });
            user = <User>_.assign({}, user); //return a (shallow) copy
            deferred.resolve(user);
        }, 300);
        return deferred.promise;
    };

    deleteUser(id: number): void { //we should have promise here, it's purposely simplified
        this.users = _.reject(this.users, (user) => {
            return user.id === id;
        });
    };

    newUser(): User {
        return { id: null, name: null, level: null };
    };

    save(user: User): void { //we should have promise here, it's purposely simplified
        if (_.isNumber(user.id)) {
            this.deleteUser(user.id);
        } else {
            user.id = this.counter++;
        }
        this.users.push(user);
    };

    addUser(name: string): void { //we should have promise here, it's purposely simplified
        this.users.push({ name: name, id: this.counter++, level: (Math.ceil(Math.random() * 4) + 1) });
    };

}
