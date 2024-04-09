import {Injectable} from "@angular/core";
import {UserQuestionModel} from "../../core/interfaces/user-question/user-question.model";
import {QuestionsPoolDetailsModel} from "../../core/interfaces/user-question/questions-pool-details.model";
import {UserQuestionApiService} from "../../core/services/api/user-question.api.service";
import {BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError} from "rxjs";
import {UserTestApiService} from "../../core/services/api/user-test.api.service";
import {GenerationStrategy} from "../../core/interfaces/questions-pool/generation-strategy.enum";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {HttpStatusCode} from "@angular/common/http";
import {AnswerModel} from "../../core/interfaces/answer/answer.model";
import {UserAnswerApiService} from "../../core/services/api/user-answer.api.service";
import {Router} from "@angular/router";
import {UserTestModel} from "../../core/interfaces/user-test/user-test.model";

@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class PassTestService {
    private userQuestionsSubject: BehaviorSubject<UserQuestionModel[] | null> = new BehaviorSubject<UserQuestionModel[] | null>(null);
    userQuestions$: Observable<UserQuestionModel[] | null> = this.userQuestionsSubject.asObservable();


    private userTestSubject: BehaviorSubject<UserTestModel | null> = new BehaviorSubject<UserTestModel | null>(null);
    userTest$: Observable<UserTestModel | null> = this.userTestSubject.asObservable();

    constructor(private userQuestionApiService: UserQuestionApiService,
                private userTestApiService: UserTestApiService,
                private userAnswerApiService: UserAnswerApiService,
                private router: Router) {
    }

    startTest(userId: string, testId: string) {
        this.userTestApiService.getUserTest(userId, testId)
            .pipe(
                untilDestroyed(this),
                tap((userTest) => {
                    this.userTestSubject.next(userTest);
                }),
                switchMap(() => this.getUserQuestionsForStartedTest(userId, testId)),
                catchError((err) => {
                    if (err.error.status == HttpStatusCode.NotFound) {
                        console.log("user test not found");
                        return this.createUserTest(userId, testId)
                            .pipe(
                                tap((data) => this.userTestSubject.next(data)),
                                switchMap((data) =>
                                    this.getUserQuestionsForNewTest(data.userId, data.test.id)
                                        .pipe(
                                            tap((data) =>
                                                this.createUserQuestions(data))
                                        )
                                )
                            )
                    }
                    return throwError(() => err);
                }),
            )
            .subscribe({
                next: (data) => {
                    this.userQuestionsSubject.next(data);
                },
                error: (err) => {
                    console.log(err);
                }
            })
    }


    createUserTest(userId: string, testId: string) {
        return this.userTestApiService.createUserTest(userId, testId);
    }

    getUserQuestionsForNewTest(userId: string, testId: string) {
        return this.userQuestionApiService.getQuestionsPoolDetailsForTest(testId)
            .pipe(
                map((questionsPools) =>
                    this.generateUserQuestions(userId, questionsPools))
            )
    }

    getUserQuestionsForStartedTest(userId: string, testId: string) {
        return this.userQuestionApiService.getUserQuestions(userId, testId);
    }

    createUserQuestions(userQuestionsModel: UserQuestionModel[]) {
        const userQuestionsToCreate = userQuestionsModel.map(uq => ({
            userId: uq.userId,
            questionId: uq.questionId
        }));
        this.userQuestionApiService.createUserQuestions(userQuestionsToCreate)
            .pipe(untilDestroyed(this))
            .subscribe();
    }


    createUserAnswers(userId: string, selectedAnswers: AnswerModel[]) {
        for (let answer of selectedAnswers) {
            this.userAnswerApiService.createUserAnswer(userId, answer.id, answer.questionId)
                .pipe(untilDestroyed(this))
                .subscribe();
        }
    }

    private generateUserQuestions(userId: string, questionsPools: QuestionsPoolDetailsModel[]): UserQuestionModel[] {
        let concatenatedQuestions: UserQuestionModel[] = [];

        for (const pool of questionsPools) {
            if (pool.generationStrategy === GenerationStrategy.Randomly) {
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

        return concatenatedQuestions;
    }

    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    completeUserTest(userId: string, testId: string) {
        this.userTestApiService.complete(userId, testId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.router.navigate(
                        ['/test-result'],
                        {
                            queryParams: {
                                id: testId
                            }
                        })
                }
            })
    }
}
