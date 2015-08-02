import {Filter} from '../core/decorators';

@Filter('paging')
export class PagingFilter implements ng.IFilter {

    constructor($q : ng.IQService) {
        console.log('Q service in pagingFilter:', $q);
    }

    filter(value: Array<any>, pageNumber: number, pageSize: number): any {
        if (value instanceof Array) {
            return value.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
        }
    }

}
