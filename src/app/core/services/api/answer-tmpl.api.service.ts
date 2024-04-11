import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AnswerTemplateModel} from "../../interfaces/answer-template/answer-template.model";
import {AnswerTemplateDto} from "../../interfaces/answer-template/answer-template.dto";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class AnswerTmplApiService {
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createAnswerTemplate(questionTmplId: string, answerTmplDto: AnswerTemplateDto) {
        return this.http.post<AnswerTemplateModel>(
            `${this.apiUrl}/api/tests/questions-pools/questions/${questionTmplId}/answers/templates`,
            answerTmplDto
        );
    }

    deleteAnswerTemplate(answerTemplateId: string) {
        return this.http.delete(`${this.apiUrl}/api/tests/questions-pools/questions/answers/templates/${answerTemplateId}`);
    }
}
