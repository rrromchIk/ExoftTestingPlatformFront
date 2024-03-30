import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagedListModel} from "../../interfaces/paged-list.model";
import {PagingSettings} from "../../interfaces/paging-settings";
import {TestToPassModel} from "../../interfaces/test-to-pass.model";
import {StartedTestModel} from "../../interfaces/started-test.model";
import {environment} from "../../../../environments/environment";
import {HttpParamsHelper} from "../../helpers/http-params.helper";
import {Filters} from "../../interfaces/filters";

@Injectable({
    providedIn: 'root'
})
export class UserTestService {
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAllTestsToPassForUser(userId: string, pagingSettings: PagingSettings, filters: Filters) {
        let queryParams = new HttpParams();
        queryParams = HttpParamsHelper.applyPaging(queryParams, pagingSettings);
        queryParams = HttpParamsHelper.applyFilters(queryParams, filters);

        const url = `${this.apiUrl}/api/users/${userId}/tests`
        return this.http.get<PagedListModel<TestToPassModel>>(
            url,
            {
                params: queryParams
            }
        );
    }

    getAllStartedTestsForUser(userId: string, pagingSettings: PagingSettings, filters: Filters) {
        let queryParams = new HttpParams();
        queryParams = HttpParamsHelper.applyPaging(queryParams, pagingSettings);
        queryParams = HttpParamsHelper.applyFilters(queryParams, filters);

        const url = `${this.apiUrl}/api/users/${userId}/tests/started`
        return this.http.get<PagedListModel<StartedTestModel>>(
            url,
            {
                params: queryParams
            }
        );
    }
}
