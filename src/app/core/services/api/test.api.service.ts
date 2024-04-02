import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {PagedListModel} from "../../interfaces/paged-list.model";
import {PagingSettings} from "../../interfaces/paging-settings";
import {TestModel} from "../../interfaces/test/test.model";
import {environment} from "../../../../environments/environment";
import {TestCreateDto} from "../../interfaces/test/test-create.dto";
import {HttpParamsHelper} from "../../helpers/http-params.helper";
import {Filters} from "../../interfaces/filters/filters";

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
        return this.http.post(this.testsEndpoint, testCreateDto)
    }

    // getAllTests(pagingSettings: PagingSettings): Observable<PagedListModel<TestModel>> {
    //     // Mock data for tests
    //     const mockPagedData: PagedListModel<TestModel> = {
    //         items: [
    //             { id: '1', name: 'Test 1', subject: 'Subject 1', duration: 30, isPublished: true, difficulty: 'Easy', createdTimestamp: new Date(), modifiedTimestamp: new Date(), createdBy: 'User 1' },
    //             { id: '2', name: 'Test 2', subject: 'Subject 2', duration: 45, isPublished: false, difficulty: 'Medium', createdTimestamp: new Date(), modifiedTimestamp: new Date(), createdBy: 'User 2' },
    //             { id: '3', name: 'Test 3', subject: 'Subject 3', duration: 60, isPublished: true, difficulty: 'Hard', createdTimestamp: new Date(), modifiedTimestamp: new Date(), createdBy: 'User 3' }
    //         ],
    //         page: 1,
    //         pageSize: 3,
    //         totalCount: 3,
    //         hasNextPage: false,
    //         hasPreviousPage: false
    //     };
    //
    //     return of(mockPagedData);
    // }
    //
    // deleteTest(testId: string) {
    //     // Mock implementation
    //     return of(null);
    // }
    //
    // updatePublishedStatus(testId: string, updatedStatus: boolean) {
    //     // Mock implementation
    //     return of(null);
    // }
}
