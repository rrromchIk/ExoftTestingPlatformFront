import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {QuestionsPoolTmplModel} from "../../interfaces/questions-pool-tmpl/questions-pool-tmpl.model";
import {QuestionsPoolTmplCreateDto} from "../../interfaces/questions-pool-tmpl/qp-tmpl-create.dto";

@Injectable({
    providedIn: "root"
})
export class QuestionsPoolTmplApiService {
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getQuestionsPoolTmplById(questionsPoolTmplId: string) {
        return this.http.get<QuestionsPoolTmplModel>(this.apiUrl + `/api/tests/questions-pools/templates/${questionsPoolTmplId}`);
    }

    // updateQuestionsPoolTmpl(questionsPoolTmplId: string, updateQpTmplDto: QuestionsPoolUpdateDto) {
    //     return this.http.put(this.apiUrl + `/api/tests/questions-pools/templates/${questionsPoolTmplId}`, updateQpDto);
    // }

    createQuestionsPoolTmpl(testTmplId: string, questionsPoolTmplDto: QuestionsPoolTmplCreateDto) {
        return this.http.post<QuestionsPoolTmplModel>(
            this.apiUrl + `/api/tests/${testTmplId}/questions-pools/templates`,
            questionsPoolTmplDto);
    }

    deleteQuestionsPoolTmpl(questionsPoolTmplId: string) {
        return this.http.delete(this.apiUrl + `/api/tests/questions-pools/templates/${questionsPoolTmplId}`);
    }
}
