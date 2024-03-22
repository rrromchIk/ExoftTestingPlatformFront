import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TestResponseDto} from '../../shared/models/test-response.dto';
import {PagedListDto} from "../../shared/models/paged-list.dto";
import {PagingSettings} from "../../shared/models/paging-settings";

@Injectable({
    providedIn: 'root'
})
export class TestService {
    private testsEndpoint = 'https://localhost:7237/api/tests';

    constructor(private http: HttpClient) {}

    getAllTests(pagingSettings: PagingSettings): Observable<PagedListDto<TestResponseDto>> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pagingSettings.page);
        queryParams = queryParams.append("pageSize", pagingSettings.pageSize);

        return this.http.get<PagedListDto<TestResponseDto>>(
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
}
