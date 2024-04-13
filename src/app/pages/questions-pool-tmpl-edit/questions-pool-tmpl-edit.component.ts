import {Component, HostListener} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {
    MAX_ANSWER_TEXT_LENGTH,
    MAX_QUESTION_POOL_NAME_LENGTH,
    MAX_QUESTION_TEXT_LENGTH,
    MIN_NUMBER_OF_QUEST_TO_GENERATE,
    MIN_QUESTION_SCORE_VALUE,
} from "../../core/constants/validation.constants";
import {GENERATION_STRATEGIES_VALUES} from "../../core/constants/view.constants";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AnswerCreateDto} from "../../core/interfaces/answer/asnwer-create.dto";
import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {filter} from "rxjs";
import {QuestionsPoolTmplModel} from "../../core/interfaces/questions-pool-tmpl/questions-pool-tmpl.model";
import {QuestionTmplModel} from "../../core/interfaces/question-template/question-tmpl.model";
import {PoolTmplEditPageService} from "./pool-tmpl-edit.page.service";
import {QuestionsPoolTmplDto} from "../../core/interfaces/questions-pool-tmpl/quest-pool-tmpl.dto";
import {QuestionTmplCreateDto} from "../../core/interfaces/question-template/question-tmpl-create.dto";
import {AnswerTemplateDto} from "../../core/interfaces/answer-template/answer-template.dto";

@UntilDestroy()
@Component({
    selector: 'app-questions-pool-tmpl-edit',
    templateUrl: './questions-pool-tmpl-edit.component.html',
    styleUrl: './questions-pool-tmpl-edit.component.scss',
    providers: [PoolTmplEditPageService]
})
export class QuestionsPoolTmplEditComponent {
    protected readonly MAX_QUESTION_POOL_NAME_LENGTH: number = MAX_QUESTION_POOL_NAME_LENGTH;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;
    protected readonly MAX_QUESTION_TEXT_LENGTH: number = MAX_QUESTION_TEXT_LENGTH;
    protected readonly MIN_QUESTION_SCORE_VALUE: number = MIN_QUESTION_SCORE_VALUE;
    protected readonly MAX_ANSWER_TEXT_LENGTH: number = MAX_ANSWER_TEXT_LENGTH;

    poolTemplate: QuestionsPoolTmplModel;
    questionTemplates: QuestionTmplModel[];

    editPoolTmplForm: FormGroup;
    poolTmplDataChanges: boolean = false;

    questionsFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private poolTmplEditPageService: PoolTmplEditPageService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private alertService: AlertService
    ) {}

    ngOnInit() {
        this.editPoolTmplForm = this.fb.group({
            defaultName: ['', [Validators.maxLength(MAX_QUESTION_POOL_NAME_LENGTH)]],
            numOfQuestionsToBeGeneratedRestriction: ['', [Validators.min(MIN_NUMBER_OF_QUEST_TO_GENERATE)]],
            generationStrategyRestriction: ['']
        });

        this.questionsFormGroup = this.fb.group({
            questionTemplates: this.fb.array([])
        })

        const poolTmplId = this.route.snapshot.params['id'];
        this.poolTmplEditPageService.getPoolTmplById(poolTmplId);
        this.poolTmplEditPageService.getQuestionTmplsByPoolTmplId(poolTmplId);

        this.poolTmplEditPageService.poolTemplate$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if (data) {
                        this.poolTemplate = data;
                        this.setPoolTemplateDataToFormFields();

                        const initialFormValues = {...this.editPoolTmplForm.value};
                        this.editPoolTmplForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.poolTmplDataChanges = this.isPoolTmplFormChanged(initialFormValues);
                            });
                    }
                }
            });


        this.poolTmplEditPageService.questionTmpls$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if (data)
                        this.questionTemplates = data;
                }
            })
    }

    getPoolTmplFormControl(name: string) {
        return this.editPoolTmplForm.get(name);
    }

    setPoolTemplateDataToFormFields() {
        this.editPoolTmplForm.patchValue({
            defaultName: this.poolTemplate.defaultName,
            numOfQuestionsToBeGeneratedRestriction: this.poolTemplate.numOfQuestionsToBeGeneratedRestriction,
            generationStrategyRestriction: this.poolTemplate.generationStrategyRestriction,
        })

        this.poolTmplDataChanges = false;
    }

    isPoolTmplFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editPoolTmplForm.value);
    }

    updatePoolTemplate() {
        if (this.editPoolTmplForm.valid) {
            const defaultName = this.editPoolTmplForm.value.defaultName;
            const numOfQuestRestr = this.editPoolTmplForm.value.numOfQuestionsToBeGeneratedRestriction;
            const genStrategyRestr = this.editPoolTmplForm.value.generationStrategyRestriction;

            const poolTmplUpdateDto: QuestionsPoolTmplDto = {
                defaultName: defaultName !== '' ? defaultName : null,
                numOfQuestionsToBeGeneratedRestriction: numOfQuestRestr != '' ? numOfQuestRestr : null,
                generationStrategyRestriction: genStrategyRestr !== '' ? genStrategyRestr : null
            };

            this.poolTmplEditPageService.updatePoolTmpl(this.poolTemplate.id, poolTmplUpdateDto);
        }
    }

    getQuestionTmplsFormArray() {
        return this.questionsFormGroup.get('questionTemplates') as FormArray;
    }

    addQuestionTmplFormGroup() {
        this.getQuestionTmplsFormArray().push(this.fb.group({
            defaultText: ['', [Validators.maxLength(MAX_QUESTION_TEXT_LENGTH)]],
            maxScoreRestriction: ['', [Validators.min(MIN_QUESTION_SCORE_VALUE)]],
            answerTemplates: this.fb.array([
                this.initAnswerTemplate(),
                this.initAnswerTemplate()
            ])
        }));
    }

    removeQuestionTmplFormGroup(index: number) {
        this.getQuestionTmplsFormArray().removeAt(index);
    }

    initAnswerTemplate() {
        return this.fb.group({
            defaultText: ['', [Validators.maxLength(MAX_ANSWER_TEXT_LENGTH)]],
            isCorrectRestriction: [false, Validators.required]
        })
    }

    getAnswerTmplsFormArray(questionIndex: number) {
        return this.getQuestionTmplsFormArray()
            .at(questionIndex)
            .get('answerTemplates') as FormArray
    }

    addAnswerTmplFormGroup(questionIndex: number) {
        this.getAnswerTmplsFormArray(questionIndex)
            .push(this.initAnswerTemplate());
    }

    removeAnswerTmplFormGroup(questionIndex: number, answerIndex: number) {
        this.getAnswerTmplsFormArray(questionIndex)
            .removeAt(answerIndex);
    }


    saveQuestionTemplate(index: number, control: AbstractControl) {
        if (control.valid) {
            const answerTmplsDto: AnswerTemplateDto[] = (control.get('answerTemplates') as FormArray).controls.map(
                control => {
                    const defaultText = control.get('defaultText')?.value;
                    return {
                        defaultText: defaultText !== '' ? defaultText : null,
                        isCorrectRestriction: control.get('isCorrectRestriction')?.value
                    };
                });

            const defaultText = control.value.defaultText;
            const maxScoreRestriction = control.value.maxScoreRestriction;

            const questionTmplDto: QuestionTmplCreateDto = {
                defaultText: defaultText !== '' ? defaultText : null,
                maxScoreRestriction: maxScoreRestriction !== '' ? maxScoreRestriction : null,
                answerTemplates: answerTmplsDto
            };

            control.markAsPristine();
            this.getQuestionTmplsFormArray().removeAt(index);
            this.poolTmplEditPageService.createQuestionTemplate(this.poolTemplate.id, questionTmplDto);
        } else {
            this.alertService.error('Fill all fields to save question template');
        }
    }

    deleteQuestionTmpl(question: QuestionTmplModel) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete question template?',
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
            .subscribe(() => this.poolTmplEditPageService.deleteQuestionTmpl(question));
    }

    canDeactivate() {
        return !this.poolTmplDataChanges && !this.questionsFormGroup.dirty;
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
}
