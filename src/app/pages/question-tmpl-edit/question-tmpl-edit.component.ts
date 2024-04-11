import {Component} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {filter} from "rxjs";
import {QuestionTmplModel} from "../../core/interfaces/question-template/question-tmpl.model";
import {
    MAX_ANSWER_TEXT_LENGTH,
    MAX_QUESTION_TEXT_LENGTH,
    MIN_QUESTION_SCORE_VALUE
} from "../../core/constants/validation.constants";
import {QuestionTmplEditPageService} from "./question-tmpl-edit.page.service";
import {QuestionTmplUpdateDto} from "../../core/interfaces/question-template/question-tmpl-update.dto";
import {AnswerTemplateDto} from "../../core/interfaces/answer-template/answer-template.dto";
import {AnswerTemplateModel} from "../../core/interfaces/answer-template/answer-template.model";

@UntilDestroy()
@Component({
    selector: 'app-question-tmpl-edit',
    templateUrl: './question-tmpl-edit.component.html',
    styleUrl: './question-tmpl-edit.component.scss',
    providers: [QuestionTmplEditPageService]
})
export class QuestionTmplEditComponent {
    protected readonly MAX_QUESTION_TEXT_LENGTH = MAX_QUESTION_TEXT_LENGTH;
    protected readonly MIN_QUESTION_SCORE_VALUE = MIN_QUESTION_SCORE_VALUE;
    protected readonly MAX_ANSWER_TEXT_LENGTH = MAX_ANSWER_TEXT_LENGTH;

    questionTemplate: QuestionTmplModel
    editQuestionTmplForm: FormGroup;
    questionTmplDataChanges: boolean = false;

    answerTmplsFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private questionTmplEditPageService: QuestionTmplEditPageService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.editQuestionTmplForm = this.fb.group({
            defaultText: ['', [Validators.maxLength(MAX_QUESTION_TEXT_LENGTH)]],
            maxScoreRestriction: ['', [Validators.min(MIN_QUESTION_SCORE_VALUE)]],
        });

        this.answerTmplsFormGroup = this.fb.group({
            answerTemplates: this.fb.array([])
        })

        const questionTmplId = this.route.snapshot.params['id'];

        this.questionTmplEditPageService.getQuestionTmplById(questionTmplId);

        this.questionTmplEditPageService.questionTemplate$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if (data) {
                        this.questionTemplate = data;

                        this.setQuestionTmplDataToFormFields();

                        const initialFormValues = {...this.editQuestionTmplForm.value};
                        this.editQuestionTmplForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.questionTmplDataChanges = this.isQuestionTmplFormChanged(initialFormValues);
                            });
                    }
                }
            });
    }

    getFormControl(name: string) {
        return this.editQuestionTmplForm.get(name);
    }

    setQuestionTmplDataToFormFields() {
        this.editQuestionTmplForm.patchValue({
            defaultText: this.questionTemplate.defaultText,
            maxScoreRestriction: this.questionTemplate.maxScoreRestriction,
        })

        this.questionTmplDataChanges = false;
    }

    isQuestionTmplFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editQuestionTmplForm.value);
    }

    updateQuestionTemplate() {
        if (this.editQuestionTmplForm.valid) {
            const questionUpdateDto: QuestionTmplUpdateDto = {
                defaultText: this.editQuestionTmplForm.value.defaultText,
                maxScoreRestriction: this.editQuestionTmplForm.value.maxScoreRestriction,
            };

            this.questionTmplEditPageService.updateQuestionTmpl(this.questionTemplate.id, questionUpdateDto);
        }
    }

    get answerTmplsFormArray() {
        return this.answerTmplsFormGroup.get('answerTemplates') as FormArray;
    }

    addAnswerTmplFormGroup() {
        this.answerTmplsFormArray.push(this.fb.group({
            defaultText: ['', [Validators.maxLength(MAX_ANSWER_TEXT_LENGTH)]],
            isCorrectRestriction: [false, Validators.required]
        }));
    }

    removeAnswerTmplFormGroup(index: number) {
        this.answerTmplsFormArray.removeAt(index);
    }

    saveAnswerTmpl(index: number, control: AbstractControl) {
        if (control.valid) {
            const answerTmplDto: AnswerTemplateDto = {
                defaultText: control.value.defaultText,
                isCorrectRestriction: control.value.isCorrectRestriction,
            };

            this.answerTmplsFormArray.removeAt(index);
            this.questionTmplEditPageService.createAnswerTmpl(this.questionTemplate.id, answerTmplDto);
        } else {
            this.alertService.error('Fill all fields');
        }
    }

    deleteAnswerTmpl(answer: AnswerTemplateModel) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete answer template?',
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
            .subscribe(() => this.questionTmplEditPageService.deleteAnswerTmpl(answer));
    }

}
