import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {AnswerCreateDto} from "../../interfaces/answer/asnwer-create.dto";
import {HttpClient} from "@angular/common/http";
import {AnswerModel} from "../../interfaces/answer/answer.model";

@Injectable({
    providedIn: "root"
})
export class AnswerApiService {
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createAnswer(questionId: string, answerCreateDto: AnswerCreateDto) {
        return this.http.post<AnswerModel>(`${this.apiUrl}/api/tests/questions-pools/questions/${questionId}/answers`, answerCreateDto);
    }

    deleteAnswer(answerId: string) {
        return this.http.delete(`${this.apiUrl}/api/tests/questions-pools/questions/answers/${answerId}`);
    }
}
