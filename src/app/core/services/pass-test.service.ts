import {Injectable} from "@angular/core";
import {UserQuestionModel} from "../interfaces/user-question.model";
import {QuestionsPoolDetailsModel} from "../interfaces/questions-pool-details.model";
import {UserQuestionService} from "./api/user-question.api.service";
import {map, Observable} from "rxjs";
import {UserTestService} from "./api/user-test.api.service";

@Injectable({
    providedIn: 'root'
})
export class PassTestService {
    constructor(private userQuestionService: UserQuestionService, private userTestService: UserTestService) {}

    createUserTest(userId: string, testId: string) {
        this.userTestService.createUserTest(userId, testId)
            .subscribe(data => console.log(data));
    }

    getUserQuestions() {
        //if user test exists
        //getUserQuestionsForStartedTest

        //else
        //getUserQuestionsForNewTest
    }

    getUserQuestionsForNewTest(userId: string, testId: string): Observable<UserQuestionModel[]> {
        return this.userQuestionService.getQuestionsPoolDetailsForTest(testId).pipe(
            map((questionsPools: QuestionsPoolDetailsModel[]) => this.generateUserQuestions(userId, questionsPools))
        );
    }

    getUserQuestionsForStartedTest(userId: string, testId: string) {
        return this.userQuestionService.getUserQuestions(userId, testId);
    }

    private generateUserQuestions(userId: string, questionsPools: QuestionsPoolDetailsModel[]): UserQuestionModel[] {
        let concatenatedQuestions: UserQuestionModel[] = [];

        for (const pool of questionsPools) {
            if (pool.generationStrategy === 'Randomly') {
                this.shuffleArray(pool.questionsId);
            }

            const numToConcatenate = Math.min(pool.numOfQuestionsToBeGenerated, pool.questionsId.length);
            concatenatedQuestions = concatenatedQuestions.concat(
                pool.questionsId
                    .slice(0, numToConcatenate)
                    .map(questionId => ({
                            userId: userId,
                            questionId,
                            isAnswered: false
                        })
                    )
            );
        }

        console.log(concatenatedQuestions);

        return concatenatedQuestions;
    }

    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
