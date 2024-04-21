import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {QuestionTmplModel} from "../../interfaces/question-template/question-tmpl.model";
import {QuestionTmplCreateDto} from "../../interfaces/question-template/question-tmpl-create.dto";
import {QuestionTmplUpdateDto} from "../../interfaces/question-template/question-tmpl-update.dto";

@Injectable({
    providedIn: "root"
})
export class QuestionTmplApiService {
    private apiUrl: string  = environment.apiUrl;
    private questionTemplatesEndpoint: string = `${this.apiUrl}/api/tests/questions-pools/questions/templates/`;

    constructor(private http: HttpClient) {}

    getQuestionTmplById(questionTmplId: string) {
        return this.http.get<QuestionTmplModel>(this.questionTemplatesEndpoint + questionTmplId);
    }

    getQuestionTmplsByPoolTmplId(poolTmplId: string) {
        return this.http.get<QuestionTmplModel[]>( `
        ${this.apiUrl}/api/tests/questions-pools/${poolTmplId}/questions/templates`);
    }

    createQuestionTmpl(poolTmplId: string, questionTmplDto: QuestionTmplCreateDto) {
        return this.http.post<QuestionTmplModel>(`${this.apiUrl}/api/tests/questions-pools/${poolTmplId}/questions/templates`,
            questionTmplDto);
    }

    deleteQuestionTmpl(questionTmplId: string) {
        return this.http.delete(this.questionTemplatesEndpoint + questionTmplId);
    }

    updateQuestionTmpl(questionTmplId: string, questionTmplUpdateDto: QuestionTmplUpdateDto) {
        return this.http.put(this.questionTemplatesEndpoint + questionTmplId, questionTmplUpdateDto);
    }
}
