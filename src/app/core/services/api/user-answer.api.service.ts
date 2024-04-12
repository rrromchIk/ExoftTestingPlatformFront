import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class UserAnswerApiService {
    private userAnswersEndpoint: string = `${environment.apiUrl}/api/users/answers`;

    constructor(private http: HttpClient) {}

    createUserAnswers(userAnswers: {userId: string, answerId: string, questionId: string}[]) {
        return this.http.post(this.userAnswersEndpoint, userAnswers);
    }
}
