import {BehaviorSubject, Observable} from "rxjs";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {HttpStatusCode} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {QuestionsPoolTmplModel} from "../../core/interfaces/questions-pool-tmpl/questions-pool-tmpl.model";
import {QuestionsPoolTmplApiService} from "../../core/services/api/questions-pool-tmpl.api.service";
import {QuestionsPoolTmplDto} from "../../core/interfaces/questions-pool-tmpl/quest-pool-tmpl.dto";
import {QuestionTmplApiService} from "../../core/services/api/question-tmpl.api.service";
import {QuestionTmplModel} from "../../core/interfaces/question-template/question-tmpl.model";
import {QuestionTmplCreateDto} from "../../core/interfaces/question-template/question-tmpl-create.dto";

@UntilDestroy()
@Injectable()
export class PoolTmplEditPageService {
    private poolTmplSubject: BehaviorSubject<QuestionsPoolTmplModel | null> =
        new BehaviorSubject<QuestionsPoolTmplModel | null>(null);
    public poolTemplate$: Observable<QuestionsPoolTmplModel | null> = this.poolTmplSubject.asObservable();

    private questionTmplsSubject: BehaviorSubject<QuestionTmplModel[] | null> = new BehaviorSubject<QuestionTmplModel[] | null>(null);
    public questionTmpls$: Observable<QuestionTmplModel[] | null> = this.questionTmplsSubject.asObservable();

    constructor(private alertService: AlertService,
                private questionsPoolTmplApiService: QuestionsPoolTmplApiService,
                private questionTmplApiService: QuestionTmplApiService) {
    }

    getPoolTmplById(questionsPoolId: string) {
        this.questionsPoolTmplApiService.getQuestionsPoolTmplById(questionsPoolId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.poolTmplSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting test");
                }
            })
    }


    updatePoolTmpl(testId: string, qpToUpdate: QuestionsPoolTmplDto) {
        this.questionsPoolTmplApiService.updateQuestionsPoolTmpl(testId, qpToUpdate)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: () => {
                        this.alertService.success("Questions pool template updated successfully");

                        const currentQuestionsPool = this.poolTmplSubject.getValue();
                        if (currentQuestionsPool) {
                            currentQuestionsPool.defaultName = qpToUpdate.defaultName;
                            currentQuestionsPool.generationStrategyRestriction = qpToUpdate.generationStrategyRestriction;
                            currentQuestionsPool.numOfQuestionsToBeGeneratedRestriction = qpToUpdate.numOfQuestionsToBeGeneratedRestriction;
                            this.poolTmplSubject.next(currentQuestionsPool);
                        }
                    },
                    error: () => {
                        this.alertService.error("Unable to update questions pool template");
                        this.poolTmplSubject.next(this.poolTmplSubject.getValue());
                    }
                }
            )
    }

    createQuestionTemplate(poolTmplId: string, questionTmplDto: QuestionTmplCreateDto) {
        this.questionTmplApiService.createQuestionTmpl(poolTmplId, questionTmplDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.alertService.success("Question template saved successfully");

                    const currentQuestionTmpls = this.questionTmplsSubject.getValue();

                    if(currentQuestionTmpls) {
                        currentQuestionTmpls.push(data);
                    } else {
                        this.questionTmplsSubject.next([data]);
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.alertService.error("Unable to save question template");
                }
            })
    }

    deleteQuestionTmpl(questionTmpl: QuestionTmplModel) {
        this.questionTmplApiService.deleteQuestionTmpl(questionTmpl.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("Question template deleted successfully");

                    let currentQuestionTmpls = this.questionTmplsSubject.getValue();

                    if(currentQuestionTmpls) {
                        currentQuestionTmpls = currentQuestionTmpls.filter(q => q.id !== questionTmpl.id);

                        this.questionTmplsSubject.next(currentQuestionTmpls);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to delete question template");
                }
            })
    }

    getQuestionTmplsByPoolTmplId(poolTmplId: any) {
        this.questionTmplApiService.getQuestionTmplsByPoolTmplId(poolTmplId)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: (data) => {
                        this.questionTmplsSubject.next(data);
                    },
                    error: (err) => {
                        if(err.status !== HttpStatusCode.NotFound)
                            this.alertService.error("Error while getting questions");
                    }
                }
            )
    }
}
