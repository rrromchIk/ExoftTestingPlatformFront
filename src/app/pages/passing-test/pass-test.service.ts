import {Injectable} from "@angular/core";
import {UserQuestionModel} from "../../core/interfaces/user-question/user-question.model";
import {UserQuestionApiService} from "../../core/services/api/user-question.api.service";
import {BehaviorSubject, forkJoin, Observable, of, switchMap} from "rxjs";
import {UserTestApiService} from "../../core/services/api/user-test.api.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
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
        this.getUserQuestions(userId, testId)
            .pipe(
                untilDestroyed(this),
                switchMap((res) => forkJoin([
                        of(res),
                        this.userTestApiService.getUserTest(userId, testId)
                    ])
                )
            )
            .subscribe(([userQuestions, userTest]) => {
                    this.userQuestionsSubject.next(userQuestions);
                    this.userTestSubject.next(userTest)
                }
            );
    }


    getUserQuestions(userId: string, testId: string) {
        return this.userQuestionApiService.getUserQuestions(userId, testId);
    }

    createUserAnswers(userId: string, selectedAnswers: AnswerModel[]) {
        const userAnswers = selectedAnswers.map(sa => ({
            userId: userId,
            answerId: sa.id,
            questionId: sa.questionId
        }))

        if (userAnswers.length > 0)
            this.userAnswerApiService.createUserAnswers(userAnswers)
                .pipe(untilDestroyed(this))
                .subscribe();
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
