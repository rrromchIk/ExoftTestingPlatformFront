import {BehaviorSubject, Observable} from "rxjs";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {QuestionTmplApiService} from "../../core/services/api/question-tmpl.api.service";
import {QuestionTmplModel} from "../../core/interfaces/question-template/question-tmpl.model";
import {QuestionTmplUpdateDto} from "../../core/interfaces/question-template/question-tmpl-update.dto";
import {AnswerTemplateDto} from "../../core/interfaces/answer-template/answer-template.dto";
import {AnswerTmplApiService} from "../../core/services/api/answer-tmpl.api.service";
import {AnswerTemplateModel} from "../../core/interfaces/answer-template/answer-template.model";

@UntilDestroy()
@Injectable()
export class QuestionTmplEditPageService {
    private questionTmplSubject: BehaviorSubject<QuestionTmplModel | null> = new BehaviorSubject<QuestionTmplModel | null>(null);
    public questionTemplate$: Observable<QuestionTmplModel | null> = this.questionTmplSubject.asObservable();

    constructor(private alertService: AlertService,
                private questionTmplApiService: QuestionTmplApiService,
                private answerTmplApiService: AnswerTmplApiService) {
    }

    getQuestionTmplById(questionTmplId: string) {
        this.questionTmplApiService.getQuestionTmplById(questionTmplId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.questionTmplSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting question template");
                }
            })
    }


    updateQuestionTmpl(testId: string, questionTmplUpdateDto: QuestionTmplUpdateDto) {
        this.questionTmplApiService.updateQuestionTmpl(testId, questionTmplUpdateDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: () => {
                        this.alertService.success("Question template updated successfully");

                        const currentQuestionTmpl = this.questionTmplSubject.getValue();
                        if (currentQuestionTmpl) {
                            currentQuestionTmpl.defaultText = questionTmplUpdateDto.defaultText;
                            currentQuestionTmpl.maxScoreRestriction = questionTmplUpdateDto.maxScoreRestriction;
                            this.questionTmplSubject.next(currentQuestionTmpl);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                        this.alertService.error("Unable to update question template");
                    }
                }
            )
    }

    createAnswerTmpl(questionTmplId: string, answerTmplDto: AnswerTemplateDto) {
        this.answerTmplApiService.createAnswerTemplate(questionTmplId, answerTmplDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.alertService.success("Answer template saved successfully");

                    const currentQuestionTemplate = this.questionTmplSubject.getValue();

                    if(currentQuestionTemplate) {
                        currentQuestionTemplate.answerTemplates!.push(data);
                    } else {
                        this.questionTmplSubject.next(currentQuestionTemplate);
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.alertService.error("Unable to save answer template");
                }
            })
    }

    deleteAnswerTmpl(answerTemplate: AnswerTemplateModel) {
        this.answerTmplApiService.deleteAnswerTemplate(answerTemplate.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("Answer template deleted successfully");

                    let currentQuestionTemplate = this.questionTmplSubject.getValue();

                    if(currentQuestionTemplate) {
                        currentQuestionTemplate.answerTemplates = currentQuestionTemplate.answerTemplates!
                            .filter(a => a.id !== answerTemplate.id);

                        this.questionTmplSubject.next(currentQuestionTemplate);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to delete answer template");
                }
            })
    }
}
