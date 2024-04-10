import {BehaviorSubject, Observable} from "rxjs";
import {QuestionModel} from "../../core/interfaces/question/question.model";
import {AlertService} from "../../shared/services/alert.service";
import {QuestionApiService} from "../../core/services/api/question.api.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {QuestionUpdateDto} from "../../core/interfaces/question/question-update.dto";
import {AnswerCreateDto} from "../../core/interfaces/answer/asnwer-create.dto";
import {AnswerApiService} from "../../core/services/api/answer.api.service";
import {AnswerModel} from "../../core/interfaces/answer/answer.model";

@UntilDestroy()
@Injectable()
export class QuestionEditPageService {
    private questionSubject: BehaviorSubject<QuestionModel | null> = new BehaviorSubject<QuestionModel | null>(null);
    public question$: Observable<QuestionModel | null> = this.questionSubject.asObservable();

    constructor(private alertService: AlertService,
                private questionApiService: QuestionApiService,
                private answerApiService: AnswerApiService) {
    }

    getQuestionById(questionId: string) {
        this.questionApiService.getQuestionById(questionId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.questionSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting test");
                }
            })
    }


    updateQuestion(testId: string, questionUpdateDto: QuestionUpdateDto) {
        this.questionApiService.updateQuestion(testId, questionUpdateDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: () => {
                        this.alertService.success("Question updated successfully");

                        const currentQuestion = this.questionSubject.getValue();
                        if (currentQuestion) {
                            currentQuestion.text = questionUpdateDto.text;
                            currentQuestion.maxScore = questionUpdateDto.maxScore;
                            this.questionSubject.next(currentQuestion);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                        this.alertService.error("Unable to update question");
                    }
                }
            )
    }

    createAnswer(questionId: string, answerDto: AnswerCreateDto) {
        this.answerApiService.createAnswer(questionId, answerDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.alertService.success("Answer saved successfully");

                    const currentQuestions = this.questionSubject.getValue();

                    if(currentQuestions) {
                        currentQuestions.answers.push(data);
                    } else {
                        this.questionSubject.next(currentQuestions);
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.alertService.error("Unable to save answer");
                }
            })
    }

    deleteAnswer(answer: AnswerModel) {
        this.answerApiService.deleteAnswer(answer.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("Answer deleted successfully");

                    let currentQuestions = this.questionSubject.getValue();

                    if(currentQuestions) {
                        currentQuestions.answers = currentQuestions.answers.filter(a => a.id !== answer.id);

                        this.questionSubject.next(currentQuestions);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to delete answer");
                }
            })
    }
}
