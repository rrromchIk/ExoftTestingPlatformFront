import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {QuestionModel} from "../../interfaces/question/question.model";
import {QuestionCreateDto} from "../../interfaces/question/question-create.dto";

@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    private apiUrl: string  = environment.apiUrl;
    private questionsEndpoint: string = `${this.apiUrl}/api/tests/questions-pools/questions/`;

    constructor(private http: HttpClient) {}

    getQuestionById(questionId: string) {
        return this.http.get<QuestionModel>(this.questionsEndpoint + questionId);
    }

    getQuestionsByQuestionPoolId(questionsPoolId: string) {
        return this.http.get<QuestionModel[]>( `${this.apiUrl}/api/tests/questions-pools/${questionsPoolId}/questions`);
    }

    createQuestion(questionsPoolId: string, questionCreateDto: QuestionCreateDto) {
        return this.http.post<QuestionModel>(`${this.apiUrl}/api/tests/questions-pools/${questionsPoolId}/questions/`,
            questionCreateDto);
    }

    deleteQuestion(questionId: string) {
        return this.http.delete(this.questionsEndpoint + questionId);
    }
}
