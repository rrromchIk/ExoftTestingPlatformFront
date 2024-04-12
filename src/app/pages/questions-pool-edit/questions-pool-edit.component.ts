import {Component} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {
    MAX_ANSWER_TEXT_LENGTH,
    MAX_QUESTION_POOL_NAME_LENGTH,
    MAX_QUESTION_TEXT_LENGTH,
    MIN_NUMBER_OF_QUEST_TO_GENERATE,
    MIN_QUESTION_SCORE_VALUE,
} from "../../core/constants/validation.constants";
import {GENERATION_STRATEGIES_VALUES} from "../../core/constants/view.constants";
import {QuestionsPoolModel} from "../../core/interfaces/questions-pool/questions-pool.model";
import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {filter} from "rxjs";
import {QuestionsPoolEditPageService} from "./questions-pool-edit.page.service";
import {QuestionsPoolUpdateDto} from "../../core/interfaces/questions-pool/questions-pool-update.dto";
import {QuestionModel} from "../../core/interfaces/question/question.model";
import {AnswerCreateDto} from "../../core/interfaces/answer/asnwer-create.dto";
import {QuestionCreateDto} from "../../core/interfaces/question/question-create.dto";
import {AlertService} from "../../shared/services/alert.service";
import {QuestionsPoolTmplModel} from "../../core/interfaces/questions-pool-tmpl/questions-pool-tmpl.model";
import {QuestionTmplModel} from "../../core/interfaces/question-template/question-tmpl.model";

@UntilDestroy()
@Component({
    selector: 'app-questions-pool-edit',
    templateUrl: './questions-pool-edit.component.html',
    styleUrl: './questions-pool-edit.component.scss',
    providers: [QuestionsPoolEditPageService]
})
export class QuestionsPoolEditComponent {
    protected readonly MAX_QUESTION_POOL_NAME_LENGTH: number = MAX_QUESTION_POOL_NAME_LENGTH;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;
    protected readonly MAX_QUESTION_TEXT_LENGTH: number = MAX_QUESTION_TEXT_LENGTH;
    protected readonly MIN_QUESTION_SCORE_VALUE: number = MIN_QUESTION_SCORE_VALUE;
    protected readonly MAX_ANSWER_TEXT_LENGTH: number = MAX_ANSWER_TEXT_LENGTH;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;

    questionsPool: QuestionsPoolModel;
    questions: QuestionModel[];

    poolTemplate: QuestionsPoolTmplModel | null;
    questionTemplates: QuestionTmplModel[];

    editQuestionsPoolForm: FormGroup;
    questionsPoolDataChanges: boolean = false;

    questionsFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private questionsPoolEditService: QuestionsPoolEditPageService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private alertService: AlertService
    ) {}

    ngOnInit() {
        this.editQuestionsPoolForm = this.fb.group({
            questionPoolName: ['', [Validators.required, Validators.maxLength(MAX_QUESTION_POOL_NAME_LENGTH)]],
            numOfQuestionsToBeGenerated: ['', [Validators.required, Validators.min(MIN_NUMBER_OF_QUEST_TO_GENERATE)]],
            generationStrategy: ['', [Validators.required]]
        });

        this.questionsFormGroup = this.fb.group({
            questions: this.fb.array([])
        })

        const questionsPoolId = this.route.snapshot.params['id'];
        this.questionsPoolEditService.getQuestionsPoolById(questionsPoolId);
        this.questionsPoolEditService.getQuestionsByQuestionPoolId(questionsPoolId);

        this.questionsPoolEditService.questionsPool$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if (data) {
                        this.questionsPool = data;
                        if (data.templateId != null) {
                            this.questionsPoolEditService.getQuestionsPoolTmplById(data.templateId);
                            this.questionsPoolEditService.getQuestionTemplatesByPoolTmplId(data.templateId);
                        }

                        this.setQuestionsPoolDataToFormFields();

                        const initialFormValues = {...this.editQuestionsPoolForm.value};
                        this.editQuestionsPoolForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.questionsPoolDataChanges = this.isQuestPoolFormChanged(initialFormValues);
                            });
                    }
                }
            });

        this.questionsPoolEditService.poolTemplate$
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                this.poolTemplate = data;
            })

        this.questionsPoolEditService.questionTemplates$
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                this.questionTemplates = data || [];
                this.addQuestionTemplatesToForm();
            })


        this.questionsPoolEditService.questions$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.questions = data || [];
                    this.addQuestionTemplatesToForm();
                }
            })
    }

    getQuestPoolFormControl(name: string) {
        return this.editQuestionsPoolForm.get(name);
    }

    setQuestionsPoolDataToFormFields() {
        this.editQuestionsPoolForm.patchValue({
            questionPoolName: this.questionsPool.name,
            numOfQuestionsToBeGenerated: this.questionsPool.numOfQuestionsToBeGenerated,
            generationStrategy: this.questionsPool.generationStrategy,
        })

        this.questionsPoolDataChanges = false;
    }

    isQuestPoolFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editQuestionsPoolForm.value);
    }

    updateQuestionsPool() {
        if (this.editQuestionsPoolForm.valid) {
            const questionsPoolUpdateDto: QuestionsPoolUpdateDto = {
                name: this.editQuestionsPoolForm.value.questionPoolName,
                numOfQuestionsToBeGenerated: this.editQuestionsPoolForm.value.numOfQuestionsToBeGenerated,
                generationStrategy: this.editQuestionsPoolForm.value.generationStrategy,
            };

            this.questionsPoolEditService.updateQuestionsPool(this.questionsPool.id, questionsPoolUpdateDto);
        }
    }

    getQuestionsFormArray() {
        return this.questionsFormGroup.get('questions') as FormArray;
    }

    addQuestionFormGroup() {
        this.getQuestionsFormArray().push(this.fb.group({
            questionText: ['', [Validators.required, Validators.maxLength(MAX_QUESTION_TEXT_LENGTH)]],
            maxScore: ['', [Validators.required, Validators.min(MIN_QUESTION_SCORE_VALUE)]],
            answers: this.fb.array([
                this.initAnswers(),
                this.initAnswers()
            ])
        }));
    }

    removeQuestionFormGroup(index: number) {
        this.getQuestionsFormArray().removeAt(index);
    }

    initAnswers() {
        return this.fb.group({
            answerText: ['', [Validators.required, Validators.maxLength(MAX_ANSWER_TEXT_LENGTH)]],
            isCorrect: [false, Validators.required]
        })
    }

    getAnswersFormArray(questionIndex: number) {
        return this.getQuestionsFormArray()
            .at(questionIndex)
            .get('answers') as FormArray
    }

    addAnswerFormGroup(questionIndex: number) {
        this.getAnswersFormArray(questionIndex)
            .push(this.initAnswers());
    }

    removeAnswerFormGroup(questionIndex: number, answerIndex: number) {
        this.getAnswersFormArray(questionIndex)
            .removeAt(answerIndex);
    }


    saveQuestion(index: number, control: AbstractControl) {
        if (control.valid) {
            const answersDto: AnswerCreateDto[] = (control.get('answers') as FormArray).controls.map(
                control => {
                    return {
                        text: control.get('answerText')?.value,
                        isCorrect: control.get('isCorrect')?.value
                    };
                });

            const questionDto: QuestionCreateDto = {
                text: control.value.questionText,
                maxScore: control.value.maxScore,
                answers: answersDto,
                templateId: control.value.templateId
            };

            this.getQuestionsFormArray().removeAt(index);
            this.questionsPoolEditService.createQuestion(this.questionsPool.id, questionDto);
        } else {
            this.alertService.error('Fill all fields to save question');
        }
    }

    deleteQuestion(question: QuestionModel) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete question?',
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
            .subscribe(() => this.questionsPoolEditService.deleteQuestion(question));
    }

    private addQuestionTemplatesToForm() {
        this.getQuestionsFormArray().clear();
        this.questionTemplates
            .filter(qt => !this.questions?.some(q => q.templateId === qt.id))
            .forEach(qt => {
            this.getQuestionsFormArray().push(
                this.fb.group({
                    questionText: [
                        qt.defaultText || '',
                        [Validators.required, Validators.maxLength(MAX_QUESTION_TEXT_LENGTH)]
                    ],
                    maxScore: [
                        qt.maxScoreRestriction || '',
                        [Validators.required, Validators.min(MIN_QUESTION_SCORE_VALUE)]
                    ],
                    templateId: [
                        qt.id || null
                    ],
                    answers: this.fb.array(
                        qt.answerTemplates!.map(at =>
                            this.fb.group({
                                answerText: [
                                    at.defaultText || '',
                                    [Validators.required, Validators.maxLength(MAX_ANSWER_TEXT_LENGTH)]
                                ],
                                isCorrect: [
                                    at.isCorrectRestriction,
                                    Validators.required
                                ]
                            })
                        )
                    )
                }))
        })
    }
}
