/// <reference path="./angular.d.ts"/>

interface RedirectingState extends ng.ui.IState {
    redirectTo: string;
}

declare module angular {

    interface IFilter {
        filter(value?: any, ...args): any;
    }
}
