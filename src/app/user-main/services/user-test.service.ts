import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagedListModel} from "../../shared/models/paged-list.model";
import {TestModel} from "../../admin-main/models/test.model";
import {PagingSettings} from "../../shared/models/paging-settings";
import {TestToPassModel} from "../../shared/models/test-to-pass.model";

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
        return this.http.get<PagedListModel<TestToPassModel>>(
            url,
            {
                params: queryParams
            }
        );
    }
}
