import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PagingSettings} from "../../interfaces/filters/paging-settings";
import {Observable} from "rxjs";
import {PagedListModel} from "../../interfaces/paged-list.model";
import {TestTemplateModel} from "../../interfaces/test-template/test-template.model";
import {environment} from "../../../../environments/environment";
import {Filters} from "../../interfaces/filters/filters";
import {HttpParamsHelper} from "../../helpers/http-params.helper";
import {TestTemplateCreateDto} from "../../interfaces/test-template/test-template-create.dto";

@Injectable({
    providedIn: 'root'
})
export class TestTmplApiService {
    private testTemplatesEndpoint: string = `${environment.apiUrl}/api/tests/templates`;

    constructor(private http: HttpClient) {}

    getAllTestTemplates(pagingSettings: PagingSettings, filters: Filters): Observable<PagedListModel<TestTemplateModel>> {
        let queryParams = new HttpParams();
        queryParams = HttpParamsHelper.applyPaging(queryParams, pagingSettings);
        queryParams = HttpParamsHelper.applyFilters(queryParams, filters);

        return this.http.get<PagedListModel<TestTemplateModel>>(this.testTemplatesEndpoint, {params: queryParams});
    }

    deleteTestTemplate(testTemplateId: string) {
        return this.http.delete(this.testTemplatesEndpoint + `/${testTemplateId}`)
    }

    createTestTemplate(testTemplateCreateDto: TestTemplateCreateDto) {
        return this.http.post(this.testTemplatesEndpoint, testTemplateCreateDto);
    }
}
