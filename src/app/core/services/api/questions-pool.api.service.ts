import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {QuestionPoolCreateDto} from "../../interfaces/questions-pool/question-pool-create.dto";
import {environment} from "../../../../environments/environment";
import {QuestionsPoolModel} from "../../interfaces/questions-pool/questions-pool.model";
import {QuestionsPoolUpdateDto} from "../../interfaces/questions-pool/questions-pool-update.dto";

@Injectable({
    providedIn: "root"
})
export class QuestionsPoolApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getQuestionsPoolById(questionsPoolId: string) {
        return this.http.get<QuestionsPoolModel>(this.apiUrl + `/api/tests/questions-pools/${questionsPoolId}`);
    }

    updateQuestionsPool(questionsPoolId: string, updateQpDto: QuestionsPoolUpdateDto) {
        return this.http.put(this.apiUrl + `/api/tests/questions-pools/${questionsPoolId}`, updateQpDto);
    }

    createQuestionsPool(testId: string, questionsPoolDto: QuestionPoolCreateDto) {
        return this.http.post<QuestionsPoolModel>(this.apiUrl + `/api/tests/${testId}/questions-pools`, questionsPoolDto);
    }

    deleteQuestionsPool(questionsPoolId: string) {
        return this.http.delete(this.apiUrl + `/api/tests/questions-pools/${questionsPoolId}`);
    }
}
