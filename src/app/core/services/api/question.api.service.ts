import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {QuestionModel} from "../../interfaces/question/question.model";

@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    private apiUrl = environment.apiUrl;
    private questionsEndpoint = `${this.apiUrl}/api/tests/questions-pools/questions/`;

    constructor(private http: HttpClient) {}

    getQuestionById(questionId: string) {
        return this.http.get<QuestionModel>(this.questionsEndpoint + questionId);
    }

    getQuestionsByQuestionPoolId(questionsPoolId: string) {
        return this.http.get<QuestionModel[]>(this.apiUrl + `/api/tests/questions-pools/${questionsPoolId}questions`);
    }
}
