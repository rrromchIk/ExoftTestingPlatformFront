import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagedListDto} from "../../shared/models/paged-list.dto";
import {TestResponseDto} from "../../shared/models/test-response.dto";
import {PagingSettings} from "../../shared/models/paging-settings";
import {TestToPassDto} from "../../shared/models/test-to-pass.dto";

@Injectable({
    providedIn: 'root'
})
export class UserTestService {

    constructor(private http: HttpClient) {
    }

    getAllTestsToPassForUser(userId: string, pagingSettings: PagingSettings) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pagingSettings.page);
        queryParams = queryParams.append("pageSize", pagingSettings.pageSize);

        const url = `https://localhost:7237/api/users/${userId}/tests?`
        return this.http.get<PagedListDto<TestToPassDto>>(
            url,
            {
                params: queryParams
            }
        );
    }
}
