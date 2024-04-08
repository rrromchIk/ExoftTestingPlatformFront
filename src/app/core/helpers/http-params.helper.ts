import { HttpParams } from '@angular/common/http';
import {PagingSettings} from "../interfaces/filters/paging-settings";
import {Filters} from "../interfaces/filters/filters";

export class HttpParamsHelper {
    static applyPaging(params: HttpParams, pagingSettings: PagingSettings): HttpParams {
        params = params.append('page', pagingSettings.page.toString());
        params = params.append('pageSize', pagingSettings.pageSize.toString());
        return params;
    }

    static applyFilters(params: HttpParams, filters: Filters): HttpParams {
        if (filters.sortColumn) {
            params = params.append('sortColumn', filters.sortColumn);
        }
        if (filters.sortOrder) {
            params = params.append('sortOrder', filters.sortOrder);
        }
        if (filters.searchTerm) {
            params = params.append('searchTerm', filters.searchTerm);
        }

        if (filters.selectFilters) {
            for (const key in filters.selectFilters) {
                if (filters.selectFilters.hasOwnProperty(key)) {
                    params = params.append(key, filters.selectFilters[key]);
                }
            }
        }

        console.log(params);

        return params;
    }
}
