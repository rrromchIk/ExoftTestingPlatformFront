import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagedListModel} from "../../interfaces/paged-list.model";
import {PagingSettings} from "../../interfaces/paging-settings";
import {TestToPassModel} from "../../interfaces/user-test/test-to-pass.model";
import {StartedTestModel} from "../../interfaces/user-test/started-test.model";
import {environment} from "../../../../environments/environment";
import {HttpParamsHelper} from "../../helpers/http-params.helper";
import {Filters} from "../../interfaces/filters/filters";
import {UserTestModel} from "../../interfaces/user-test/user-test.model";
import {TestResultModel} from "../../interfaces/test-result/test-result.model";

@Injectable({
    providedIn: 'root'
})
export class UserTestApiService {
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

    createUserTest(userId: string, testId: string) {
        return this.http.post<UserTestModel>(this.apiUrl + `/api/users/${userId}/tests/${testId}`, null);
    }

    getUserTest(userId: string, testId: string) {
        return this.http.get<UserTestModel>(this.apiUrl + `/api/users/${userId}/tests/${testId}`)
    }

    getUserTestResult(userId: string, testId: string) {
        return this.http.get<TestResultModel>(this.apiUrl + `/api/users/${userId}/tests/${testId}/results`)
    }

    complete(userId: string, testId: string) {
        return this.http.patch(this.apiUrl + `/api/users/${userId}/tests/${testId}/complete`, null);
    }
}
