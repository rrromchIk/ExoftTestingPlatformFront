import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagedListModel} from "../../interfaces/paged-list.model";
import {PagingSettings} from "../../interfaces/paging-settings";
import {TestModel} from "../../interfaces/test/test.model";
import {environment} from "../../../../environments/environment";
import {TestCreateDto} from "../../interfaces/test/test-create.dto";
import {HttpParamsHelper} from "../../helpers/http-params.helper";
import {Filters} from "../../interfaces/filters/filters";
import {TestUpdateDto} from "../../interfaces/test/test-update.dto";

@Injectable({
    providedIn: 'root'
})
export class TestApiService {
    private testsEndpoint = `${environment.apiUrl}/api/tests`;

    constructor(private http: HttpClient) {}

    getAllTests(pagingSettings: PagingSettings, filters: Filters): Observable<PagedListModel<TestModel>> {
        let queryParams = new HttpParams();
        queryParams = HttpParamsHelper.applyPaging(queryParams, pagingSettings);
        queryParams = HttpParamsHelper.applyFilters(queryParams, filters);

        return this.http.get<PagedListModel<TestModel>>(
            this.testsEndpoint,
            {
                params: queryParams
            }
        );
    }

    deleteTest(testId: string) {
        return this.http.delete(this.testsEndpoint + `/${testId}`)
    }

    updatePublishedStatus(testId: string, updatedStatus: boolean) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("isPublished", updatedStatus);

        return this.http.patch<HttpResponse<any>>(
            this.testsEndpoint + `/${testId}/publish`,
            null,
            {
                params: queryParams
            }
        );
    }

    createTest(testCreateDto: TestCreateDto) {
        return this.http.post<TestModel>(this.testsEndpoint, testCreateDto)
    }

    updateTest(testId: string, updatedTest: TestUpdateDto) {
        return this.http.put(this.testsEndpoint + `/${testId}`, updatedTest);
    }

    getTestById(testId: string) {
        return this.http.get<TestModel>(this.testsEndpoint + `/${testId}/questions-pools`);
    }
}
