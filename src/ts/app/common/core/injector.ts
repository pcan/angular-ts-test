
var angularNames = {
    //Angular core
    'IRootScopeService': '$rootScope',
    'IScope': '$scope',
    'IParseService': '$parse',
    'IFilterService': '$filter',
    'ITimeoutService': '$timeout',
    'ICompileProvider': '$compileProvider',
    'IQService': '$q',

    //ui-router
    'IStateService': '$state',
    'IStateParamsService': '$stateParams',
    'IStateProvider': '$stateProvider',
    'IUrlRouterProvider': '$urlRouterProvider',

    //Angular resource
    'IResourceService': '$resource'
}

export class Injector {

    inject(target: any): any[] {
        var params = this.resolveParamNames(target);
        params.push(target);
        return params;
    }

    resolveTypeName(target: any): string {
        return Reflect.getMetadata("design:typename", target);
    }

    resolveInterface(item): string {
        if (item) {
            var name = angularNames[item.__i];
            if (!name && item.__base instanceof Array) {
                for (var i = 0; i < item.__base.length && !name; i++) {
                    name = this.resolveInterface(item.__base[i]);
                }
            }
            return name;
        }
    }

    resolveParamNames(target: Function, methodName?: string): string[] {
        var metadata: Array<any> = Reflect.getMetadata("design:paramtypes", target, methodName);
        var names: string[] = _.map<any, string>(metadata, (item, i) => {
            var name: string = Reflect.getMetadata(this.buildParamMetadataKey(i), target, methodName); //todo: really always null??? only for ctor!
            if (!name) {
                if (typeof item === 'function') {
                    name = Reflect.getMetadata("design:typename", item);
                } else if (typeof item === 'object' && typeof item.__i === 'string') {
                    name = this.resolveInterface(item);
                }
                if (!name) {
                    console.warn('Unknown dependency found for', target, 'at index', i);
                }
            }
            return name;
        });
        return names;
    }

    registerInjectedParam(target: any, methodName: string, index: number, value: string) {
        Reflect.defineMetadata(this.buildParamMetadataKey(index), value, target, methodName);
    }

    registerStateValueResolver(target: Function, methodName: string, method: Function, resolveName: string) {
        var params:Array<any> = this.resolveParamNames(target, methodName);
        params.push(method);
        var resolveObj = Reflect.getMetadata('state:resolve', target) || {};
        resolveObj[resolveName] = params;
        Reflect.defineMetadata('state:resolve', resolveObj, target);
    }

    getStateResolveObject(target: any) {
        return Reflect.getMetadata('state:resolve', target) || {};
    }

    private buildParamMetadataKey(index: number) {
        return ':p_' + index;
    }

}
