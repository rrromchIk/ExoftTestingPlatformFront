import {BehaviorSubject, Observable} from "rxjs";
import {AlertService} from "../../../shared/services/alert.service";
import {QuestionsPoolApiService} from "../../../core/services/api/questions-pool.api.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {QuestionsPoolModel} from "../../../core/interfaces/questions-pool/questions-pool.model";
import {Injectable} from "@angular/core";
import {QuestionsPoolUpdateDto} from "../../../core/interfaces/questions-pool/questions-pool-update.dto";
import {QuestionApiService} from "../../../core/services/api/question.api.service";
import {QuestionModel} from "../../../core/interfaces/question/question.model";
import {QuestionCreateDto} from "../../../core/interfaces/question/question-create.dto";
import {HttpStatusCode} from "@angular/common/http";

@UntilDestroy()
@Injectable()
export class QuestionsPoolEditPageService {
    private questionsPoolSubject: BehaviorSubject<QuestionsPoolModel | null> = new BehaviorSubject<QuestionsPoolModel | null>(null);
    public questionsPool$: Observable<QuestionsPoolModel | null> = this.questionsPoolSubject.asObservable();

    private questionsSubject: BehaviorSubject<QuestionModel[] | null> = new BehaviorSubject<QuestionModel[] | null>(null);
    public questions$: Observable<QuestionModel[] | null> = this.questionsSubject.asObservable();

    constructor(private alertService: AlertService,
                private questionsPoolApiService: QuestionsPoolApiService,
                private questionsApiService: QuestionApiService) {
    }

    getQuestionsPoolById(questionsPoolId: string) {
        this.questionsPoolApiService.getQuestionsPoolById(questionsPoolId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.questionsPoolSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting test");
                }
            })
    }


    updateQuestionsPool(testId: string, qpToUpdate: QuestionsPoolUpdateDto) {
        this.questionsPoolApiService.updateQuestionsPool(testId, qpToUpdate)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: () => {
                        this.alertService.success("Questions pool updated successfully");

                        const currentQuestionsPool = this.questionsPoolSubject.getValue();
                        if (currentQuestionsPool) {
                            currentQuestionsPool.name = qpToUpdate.name;
                            currentQuestionsPool.numOfQuestionsToBeGenerated = qpToUpdate.numOfQuestionsToBeGenerated;
                            currentQuestionsPool.generationStrategy = qpToUpdate.generationStrategy;
                            this.questionsPoolSubject.next(currentQuestionsPool);
                        }
                    },
                    error: () => {
                        this.alertService.error("Unable to update questions pool");
                        this.questionsPoolSubject.next(this.questionsPoolSubject.getValue());
                    }
                }
            )
    }

    createQuestion(questionsPoolId: string, questionDto: QuestionCreateDto) {
        this.questionsApiService.createQuestion(questionsPoolId, questionDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.alertService.success("Question saved successfully");

                    const currentQuestions = this.questionsSubject.getValue();

                    if(currentQuestions) {
                        currentQuestions.push(data);
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.alertService.error("Unable to save question");
                }
            })
    }

    deleteQuestion(question: QuestionModel) {
        this.questionsApiService.deleteQuestion(question.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("Question deleted successfully");

                    let currentQuestions = this.questionsSubject.getValue();

                    if(currentQuestions) {
                        currentQuestions = currentQuestions.filter(q => q.id !== question.id);

                        this.questionsSubject.next(currentQuestions);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to delete question");
                }
            })
    }

    getQuestionsByQuestionPoolId(questionsPoolId: any) {
        this.questionsApiService.getQuestionsByQuestionPoolId(questionsPoolId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.questionsSubject.next(data);
                },
                error: (err) => {
                    if(err.status !== HttpStatusCode.NotFound)
                        this.alertService.error("Error while getting questions");
                }
            }
        )
    }
}
