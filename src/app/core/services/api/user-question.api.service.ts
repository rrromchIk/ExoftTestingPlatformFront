import {Injectable} from "@angular/core";
import {QuestionsPoolDetailsModel} from "../../interfaces/user-question/questions-pool-details.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {UserQuestionModel} from "../../interfaces/user-question/user-question.model";

@Injectable({
    providedIn: 'root'
})
export class UserQuestionService {
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getQuestionsPoolDetailsForTest(testId: string) {
        return this.http.get<QuestionsPoolDetailsModel[]>(`${this.apiUrl}/api/users/tests/${testId}/questions`);
    }

    getUserQuestions(userId: string, testId: string) {
        return this.http.get<UserQuestionModel[]>(`${this.apiUrl}/api/users/${userId}/tests/${testId}/questions`);
    }

    createUsersQuestions(userQuestions: {userId: string, questionId: string}[]) {
        return this.http.post(`${this.apiUrl}/api/users/questions`, userQuestions);
    }
}
