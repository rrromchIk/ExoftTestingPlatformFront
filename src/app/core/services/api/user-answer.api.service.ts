import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class UserAnswerApiService {
    private userAnswersEndpoint: string = `${environment.apiUrl}/api/users/answers`;

    constructor(private http: HttpClient) {}

    createUserAnswer(userId: string, answerId: string, questionId: string) {
        return this.http.post(this.userAnswersEndpoint, {userId, answerId, questionId});
    }
}
