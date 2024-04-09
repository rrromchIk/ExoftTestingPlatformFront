import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {AlertService} from "../../../shared/services/alert.service";
import {BehaviorSubject, Observable} from "rxjs";
import {TestApiService} from "../../../core/services/api/test.api.service";
import {TestModel} from "../../../core/interfaces/test/test.model";
import {TestUpdateDto} from "../../../core/interfaces/test/test-update.dto";
import {HttpStatusCode} from "@angular/common/http";
import {QuestionPoolCreateDto} from "../../../core/interfaces/questions-pool/question-pool-create.dto";
import {QuestionsPoolApiService} from "../../../core/services/api/questions-pool.api.service";
import {QuestionsPoolModel} from "../../../core/interfaces/questions-pool/questions-pool.model";

@UntilDestroy()
@Injectable()
export class TestEditPageService {
    private testSubject: BehaviorSubject<TestModel | null> = new BehaviorSubject<TestModel | null>(null);
    public test$: Observable<TestModel  | null> = this.testSubject.asObservable();

    constructor(private alertService: AlertService,
                private testApiService: TestApiService,
                private questionsPoolApiService: QuestionsPoolApiService
    ) {}

    getTestById(testId: string) {
        this.testApiService.getTestById(testId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.testSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting test");
                }
            })
    }


    updateTest(testId: string, testToUpdate: TestUpdateDto) {
        this.testApiService.updateTest(testId, testToUpdate)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: () => {
                        this.alertService.success("Test updated successfully");

                        const currentTest = this.testSubject.getValue();
                        if(currentTest) {
                            currentTest.name = testToUpdate.name;
                            currentTest.subject = testToUpdate.subject;
                            currentTest.duration = testToUpdate.duration;
                            currentTest.difficulty = testToUpdate.difficulty;
                            this.testSubject.next(currentTest);
                        }
                    },
                    error: (error) => {
                        if (error.status === HttpStatusCode.Conflict) {
                            this.alertService.error('Test with such name already exists');
                            this.testSubject.error(new Error());
                        } else {
                            this.alertService.error("Unable to update test");
                        }

                        this.testSubject.next(this.testSubject.getValue());
                    }
                }
            )
    }

    createQuestionPool(testId: string, questionPoolDto: QuestionPoolCreateDto) {
        this.questionsPoolApiService.createQuestionsPool(testId, questionPoolDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.alertService.success("Questions pool saved successfully");

                    const currentTest = this.testSubject.getValue();

                    if(currentTest) {
                        currentTest.questionsPools!.push(data);
                        this.testSubject.next(currentTest);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to save questions pool");
                }
            })
    }

    deleteQuestionsPool(questionsPool: QuestionsPoolModel) {
        this.questionsPoolApiService.deleteQuestionsPool(questionsPool.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("Questions pool deleted successfully");

                    const currentTest = this.testSubject.getValue();

                    if(currentTest) {
                        currentTest.questionsPools = currentTest.questionsPools!
                            .filter(qp => qp.id !== questionsPool.id);

                        this.testSubject.next(currentTest);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to delete questions pool");
                }
            })
    }
}
