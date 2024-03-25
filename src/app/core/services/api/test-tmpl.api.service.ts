import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagingSettings} from "../../../shared/models/paging-settings";
import {Observable} from "rxjs";
import {PagedListModel} from "../../../shared/models/paged-list.model";
import {TestTemplateModel} from "../../interfaces/test-template.model";

@Injectable({
    providedIn: 'root'
})
export class TestTmplService {
    private testTemplatesEndpoint = 'https://localhost:7237/api/tests/templates';

    constructor(private http: HttpClient) {}

    getAllTestTemplates(pagingSettings: PagingSettings): Observable<PagedListModel<TestTemplateModel>> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pagingSettings.page);
        queryParams = queryParams.append("pageSize", pagingSettings.pageSize);

        return this.http.get<PagedListModel<TestTemplateModel>>(
            this.testTemplatesEndpoint,
            {
                params: queryParams
            }
        );
    }

    deleteTestTemplate(testTemplateId: string) {
        return this.http.delete(this.testTemplatesEndpoint + `/${testTemplateId}`)
    }
}
