import {app} from './module';
import {Injector} from './injector';

var injector: Injector = new Injector();

var allStates: Array<ng.ui.IState> = [];
function addState(state: ng.ui.IState, controller: Function, controllerName: string) {
    state.controller = controllerName;
    state.controllerAs = state.controllerAs || 'ctrl';
    var resolveObj = injector.getStateResolveObject(controller);
    if (state.resolve) {
        angular.extend(resolveObj, state.resolve);
    }
    state.resolve = resolveObj;
    allStates.push(state);
}

export function ConfigBlock() {
    return function(target: any) {
        app.config(injector.inject(target));
        return target;
    }
}

export function RunBlock() {
    return function(target: any) {
        app.run(injector.inject(target));
        return target;
    }
}

export function Controller() {
    return function(target: any) {
        app.controller(injector.resolveTypeName(target), injector.inject(target));
        return target;
    }
}

export function Service() {
    return function(target: any) {
        app.service(injector.resolveTypeName(target), injector.inject(target));
        return target;
    }
}

export function Factory() {
    return function(target: any) {
        app.factory(injector.resolveTypeName(target), injector.inject(target));
        return target;
    }
}

export function Directive(directiveName) {
    return function(target: any) {
        var directiveFactory: ng.IDirectiveFactory = (...args) => {
            var directive: ng.IDirective = new target(...args);
            if (directive.controller) {
                var controllerName = injector.resolveTypeName(directive.controller);
                if (!controllerName) {
                    console.warn('Cannot resolve name for controller', directive.controller, 'of directive', directiveName);
                }
                directive.controller = controllerName;
                directive.controllerAs = directive.controllerAs || 'ctrl';
            }
            return directive;
        };
        var constructorArray: Array<any> = injector.resolveParamNames(target);
        app.directive(directiveName, constructorArray.concat(directiveFactory));
        return target;
    }
}

export function Filter(filterName: string) {
    return function(target: any) {
        var filterFactory = (...args) => {
            var filterObject = new target(...args);
            if (typeof filterObject.filter === 'function') {
                return filterObject.filter.bind(filterObject);
            }
            console.warn('Invalid filter: filter() method not found for:', filterName)
            return function() { }; //dummy filter, so it won't break everything
        };
        var constructorArray: Array<any> = injector.resolveParamNames(target);
        app.filter(filterName, constructorArray.concat(filterFactory));
        return target;
    }
}

export function View(state: ng.ui.IState) {
    return function(target: any) {
        var name = injector.resolveTypeName(target);
        app.controller(name, injector.inject(target));
        addState(state, target, name);
        return target;
    }
}

export function Views(states: ng.ui.IState[]) {
    return function(target: any) {
        var name = injector.resolveTypeName(target);
        app.controller(name, injector.inject(target));
        _.forEach(states, (s) => addState(s, target, name));
        return target;
    }
}

export function Inject(name: string) { //Param decorator
    return function(target: any, key: string, index: number) {
        injector.registerInjectedParam(target, key, index, name);
    }
}

export function ValueResolver(value: string) {
    return function <T extends Function>(target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
        injector.registerStateValueResolver(target, propertyKey, descriptor.value, value);
    }
}

@ConfigBlock()
class StateConfig {

    constructor($stateProvider: ng.ui.IStateProvider) {
        _.forEach(allStates, (state) => {
            var name = state.name;
            if (!name) {
                console.warn('State name not defined for state', state);
            }
            $stateProvider.state(name, state);
        });
    }

}
