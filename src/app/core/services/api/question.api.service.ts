import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {QuestionModel} from "../../interfaces/question.model";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private questionsEndpoint = `${environment.apiUrl}/api/tests/questions-pools/questions/`;

    constructor(private http: HttpClient) {}

    getQuestionById(questionId: string) {
        return this.http.get<QuestionModel>(this.questionsEndpoint + questionId);
    }
}
