import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {QuestionPoolCreateDto} from "../../interfaces/questions-pool/question-pool-create.dto";
import {environment} from "../../../../environments/environment";
import {QuestionsPoolModel} from "../../interfaces/questions-pool/questions-pool.model";

@Injectable({
    providedIn: "root"
})
export class QuestionsPoolApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    createQuestionsPool(testId: string, questionsPoolDto: QuestionPoolCreateDto) {
        return this.http.post<QuestionsPoolModel>(this.apiUrl + `/api/tests/${testId}/questions-pools`, questionsPoolDto);
    }

    deleteQuestionsPool(questionsPoolId: string) {
        return this.http.delete(this.apiUrl + `/api/tests/questions-pools/${questionsPoolId}`);
    }
}
