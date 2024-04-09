import {Component} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {
    MAX_QUESTION_POOL_NAME_LENGTH,
    MAX_TEST_NAME_LENGTH,
    MAX_TEST_SUBJECT_LENGTH, MIN_NUMBER_OF_QUEST_TO_GENERATE,
    MIN_TEST_DURATION_VALUE
} from "../../../core/constants/validation.constants";
import {TestCreateDto} from "../../../core/interfaces/test/test-create.dto";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute} from "@angular/router";
import {TestEditPageService} from "../services/test-edit.page.service";
import {DIFFICULTY_VALUES, GENERATION_STRATEGIES_VALUES} from "../../../core/constants/view.constants";
import {TestModel} from "../../../core/interfaces/test/test.model";
import {QuestionPoolCreateDto} from "../../../core/interfaces/questions-pool/question-pool-create.dto";
import {QuestionsPoolModel} from "../../../core/interfaces/questions-pool/questions-pool.model";
import {DialogDataDto} from "../../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../../shared/components/dialog/confirmation-dialog.component";
import {filter} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../../shared/services/alert.service";

@UntilDestroy()
@Component({
    selector: 'app-test-edit',
    templateUrl: './test-edit.component.html',
    styleUrl: './test-edit.component.scss',
    providers: [TestEditPageService]
})
export class TestEditComponent {
    protected readonly MAX_TEST_NAME_LENGTH: number = MAX_TEST_NAME_LENGTH;
    protected readonly MAX_TEST_SUBJECT_LENGTH: number = MAX_TEST_SUBJECT_LENGTH;
    protected readonly MIN_TEST_DURATION_VALUE: number = MIN_TEST_DURATION_VALUE;
    protected readonly DIFFICULTY_VALUES: string[] = DIFFICULTY_VALUES;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;
    protected readonly MAX_QUESTION_POOL_NAME_LENGTH: number = MAX_QUESTION_POOL_NAME_LENGTH;

    test: TestModel
    editTestForm: FormGroup;
    testDataChanges: boolean = false;

    questionsPoolFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private testEditPageService: TestEditPageService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private alertService: AlertService
    ) {}

    ngOnInit() {
        this.editTestForm = this.fb.group({
            testName: ['', [Validators.required, Validators.maxLength(MAX_TEST_NAME_LENGTH)]],
            subject: ['', [Validators.required, Validators.maxLength(MAX_TEST_SUBJECT_LENGTH)]],
            duration: ['', [Validators.required, Validators.min(MIN_TEST_DURATION_VALUE)]],
            difficulty: ['', Validators.required]
        });

        this.questionsPoolFormGroup = this.fb.group({
            questionPools: this.fb.array([])
        })

        const testId = this.route.snapshot.params['id'];

        this.testEditPageService.getTestById(testId);

        this.testEditPageService.test$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if(data) {
                        this.test = data;

                        this.setTestDataToFormFields();

                        const initialFormValues = { ...this.editTestForm.value };
                        this.editTestForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.testDataChanges = this.isTestFormChanged(initialFormValues);
                            });
                    }
                },
                error: () => {
                    this.editTestForm.controls['testName'].setErrors({'conflict': true})
                }
            });
    }

    getFormControl(name: string) {
        return this.editTestForm.get(name);
    }

    setTestDataToFormFields() {
        this.editTestForm.patchValue({
            testName: this.test.name,
            subject: this.test.subject,
            duration: this.test.duration,
            difficulty: this.test.difficulty,
        })

        this.testDataChanges = false;
    }

    isTestFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editTestForm.value);
    }

    updateTest() {
        if (this.editTestForm.valid) {

            const testCreateDto: TestCreateDto = {
                name: this.editTestForm.value.testName,
                subject: this.editTestForm.value.subject,
                duration: this.editTestForm.value.duration,
                difficulty: this.editTestForm.value.difficulty,
            };

            this.testEditPageService.updateTest(this.test.id, testCreateDto);
        }
    }

    get questionPoolsFormArray() {
        return this.questionsPoolFormGroup.get('questionPools') as FormArray;
    }

    addQuestionPoolFormGroup() {
        this.questionPoolsFormArray.push(this.fb.group({
            questionPoolName: ['', [Validators.required, Validators.maxLength(MAX_QUESTION_POOL_NAME_LENGTH)]],
            numOfQuestionsToBeGenerated: ['', [Validators.required, Validators.min(MIN_NUMBER_OF_QUEST_TO_GENERATE)]],
            generationStrategy: ['', [Validators.required]]
        }));
    }

    removeQuestionPoolFormGroup(index: number) {
        this.questionPoolsFormArray.removeAt(index);
    }

    saveQuestionPool(index: number, control: AbstractControl) {
        if (control.valid) {
            const questionPoolDto: QuestionPoolCreateDto = {
                name: control.value.questionPoolName,
                numOfQuestionsToBeGenerated: control.value.numOfQuestionsToBeGenerated,
                generationStrategy: control.value.generationStrategy
            };

            this.questionPoolsFormArray.removeAt(index);
            this.testEditPageService.createQuestionPool(this.test.id, questionPoolDto);
        } else {
            this.alertService.error('Fill all fields');
        }
    }

    deleteQuestionsPool(questionsPool: QuestionsPoolModel) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete questions pool?',
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
            .subscribe(() => this.testEditPageService.deleteQuestionsPool(questionsPool));
    }
}
