import {Component, HostListener} from '@angular/core';
import {QuestionModel} from "../../core/interfaces/question/question.model";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {filter} from "rxjs";
import {QuestionEditPageService} from "./question-edit.page.service";

import {
    MAX_ANSWER_TEXT_LENGTH,
    MAX_QUESTION_TEXT_LENGTH,
    MIN_QUESTION_SCORE_VALUE
} from "../../core/constants/validation.constants";
import {QuestionUpdateDto} from "../../core/interfaces/question/question-update.dto";
import {AnswerCreateDto} from "../../core/interfaces/answer/asnwer-create.dto";
import {AnswerModel} from "../../core/interfaces/answer/answer.model";
import {CanDeactivateComponent} from "../../core/guards/guards";
import {QuestionTmplModel} from "../../core/interfaces/question-template/question-tmpl.model";

@UntilDestroy()
@Component({
    selector: 'app-question-edit',
    templateUrl: './question-edit.component.html',
    styleUrl: './question-edit.component.scss',
    providers: [QuestionEditPageService]
})
export class QuestionEditComponent implements CanDeactivateComponent {
    protected readonly MIN_QUESTION_SCORE_VALUE = MIN_QUESTION_SCORE_VALUE;
    protected readonly MAX_QUESTION_TEXT_LENGTH = MAX_QUESTION_TEXT_LENGTH;

    question: QuestionModel
    editQuestionForm: FormGroup;
    questionDataChanges: boolean = false;

    questionTemplate: QuestionTmplModel | null;

    answersFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private questionEditPageService: QuestionEditPageService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private alertService: AlertService
    ) {}

    ngOnInit() {
        this.editQuestionForm = this.fb.group({
            questionText: ['', [Validators.required, Validators.maxLength(MAX_QUESTION_TEXT_LENGTH)]],
            maxScore: ['', [Validators.required, Validators.min(MIN_QUESTION_SCORE_VALUE)]],
        });

        this.answersFormGroup = this.fb.group({
            answers: this.fb.array([])
        })

        const questionId = this.route.snapshot.params['id'];

        this.questionEditPageService.getQuestionById(questionId);

        this.questionEditPageService.question$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if(data) {
                        this.question = data;
                        if (data.templateId != null) {
                            this.questionEditPageService.getQuestionTmplById(data.templateId);
                        }

                        this.addAnswersTemplatesToForm();
                        this.setQuestionDataToFormFields();

                        const initialFormValues = { ...this.editQuestionForm.value };
                        this.editQuestionForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.questionDataChanges = this.isQuestionFormChanged(initialFormValues);
                            });
                    }
                }
            });

        this.questionEditPageService.questionTmpl$
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                this.questionTemplate = data;
                this.addAnswersTemplatesToForm();
            })

    }

    getFormControl(name: string) {
        return this.editQuestionForm.get(name);
    }

    setQuestionDataToFormFields() {
        this.editQuestionForm.patchValue({
            questionText: this.question.text,
            maxScore: this.question.maxScore,
        })

        this.questionDataChanges = false;
    }

    isQuestionFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editQuestionForm.value);
    }

    updateQuestion() {
        if (this.editQuestionForm.valid) {
            const questionUpdateDto: QuestionUpdateDto = {
                text: this.editQuestionForm.value.questionText,
                maxScore: this.editQuestionForm.value.maxScore,
            };

            this.questionEditPageService.updateQuestion(this.question.id, questionUpdateDto);
        }
    }

    get answersFormArray() {
        return this.answersFormGroup.get('answers') as FormArray;
    }

    addAnswerFormGroup() {
        this.answersFormArray.push(this.fb.group({
            answerText: ['', [Validators.required, Validators.maxLength(MAX_ANSWER_TEXT_LENGTH)]],
            isCorrect: [false, Validators.required]
        }));
    }

    removeAnswerFormGroup(index: number) {
        this.answersFormArray.removeAt(index);
    }

    saveAnswer(index: number, control: AbstractControl) {
        if (control.valid) {
            const questionPoolDto: AnswerCreateDto = {
                text: control.value.answerText,
                isCorrect: control.value.isCorrect,
            };

            control.markAsPristine();
            this.answersFormArray.removeAt(index);
            this.questionEditPageService.createAnswer(this.question.id, questionPoolDto);
        } else {
            this.alertService.error('Fill all fields');
        }
    }

    deleteAnswer(answer: AnswerModel) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete answer?',
        };

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: dialogData
        });

        dialogRef
            .afterClosed()
            .pipe(
                untilDestroyed(this),
                filter((result) => result),
            )
            .subscribe(() => this.questionEditPageService.deleteAnswer(answer));
    }

    addAnswersTemplatesToForm() {
        this.answersFormArray.clear();
        if(this.questionTemplate) {
            this.questionTemplate.answerTemplates!
                .filter(at => !this.question.answers?.some(a => a.templateId === at.id))
                .forEach(at => {
                    this.answersFormArray.push(
                        this.fb.group({
                            answerText: [
                                at.defaultText || '',
                                [Validators.required, Validators.maxLength(MAX_ANSWER_TEXT_LENGTH)]],
                            isCorrect: [
                                at.isCorrectRestriction,
                                Validators.required
                            ]
                        }))
                })
        }

    }

    canDeactivate() {
        return !this.questionDataChanges && !this.answersFormGroup.dirty;
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload($event: BeforeUnloadEvent) {
        if (!this.canDeactivate()) {
            $event.preventDefault();
            $event.returnValue = '';
            return false;
        }

        return true;
    }

    protected readonly MAX_ANSWER_TEXT_LENGTH = MAX_ANSWER_TEXT_LENGTH;
}
