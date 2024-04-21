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
import {TestTmplUpdateDto} from "../../interfaces/test-template/test-tmpl-update.dto";
import {TestTmplShortInfoModel} from "../../interfaces/test-template/test-tmpl-short-info.model";

@Injectable({
    providedIn: 'root'
})
export class TestTmplApiService {
    private testTemplatesEndpoint: string = `${environment.apiUrl}/api/tests/templates`;

    constructor(private http: HttpClient) {}

    getAllTestTmplsShortInfo() {
        return this.http.get<TestTmplShortInfoModel[]>(`${this.testTemplatesEndpoint}/short-info`);
    }

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
        return this.http.post<TestTemplateModel>(this.testTemplatesEndpoint, testTemplateCreateDto);
    }

    getTestTmplById(testTmplId: string) {
        return this.http.get<TestTemplateModel>(`${this.testTemplatesEndpoint}/${testTmplId}/questions-pools/templates`);
    }

    updateTestTmpl(testTmplId: string, testTmplUpdateDto: TestTmplUpdateDto) {
        return this.http.put(`${this.testTemplatesEndpoint}/${testTmplId}`, testTmplUpdateDto)
    }
}
