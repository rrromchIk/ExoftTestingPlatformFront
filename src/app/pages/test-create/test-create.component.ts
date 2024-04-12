import {Component, HostListener} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators
} from "@angular/forms";
import {
    MAX_QUESTION_POOL_NAME_LENGTH,
    MAX_TEST_NAME_LENGTH,
    MAX_TEST_SUBJECT_LENGTH, MIN_NUMBER_OF_QUEST_TO_GENERATE,
    MIN_TEST_DURATION_VALUE
} from "../../core/constants/validation.constants";

import {
    DIFFICULTY_VALUES,
    GENERATION_STRATEGIES_VALUES
} from "../../core/constants/view.constants";
import {TestApiService} from "../../core/services/api/test.api.service";
import {TestCreateDto} from "../../core/interfaces/test/test-create.dto";
import {QuestionPoolCreateDto} from "../../core/interfaces/questions-pool/question-pool-create.dto";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AlertService} from "../../shared/services/alert.service";
import {HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {TestTmplShortInfoModel} from "../../core/interfaces/test-template/test-tmpl-short-info.model";
import {TestTmplApiService} from "../../core/services/api/test-tmpl.api.service";
import {TestTemplateModel} from "../../core/interfaces/test-template/test-template.model";
import {CanDeactivateComponent} from "../../core/guards/guards";

@UntilDestroy(this)
@Component({
    selector: 'app-test-create',
    templateUrl: './test-create.component.html',
    styleUrl: './test-create.component.scss'
})
export class TestCreateComponent implements CanDeactivateComponent {
    protected readonly MAX_TEST_NAME_LENGTH: number = MAX_TEST_NAME_LENGTH;
    protected readonly MAX_TEST_SUBJECT_LENGTH: number = MAX_TEST_SUBJECT_LENGTH;
    protected readonly MIN_TEST_DURATION_VALUE: number = MIN_TEST_DURATION_VALUE;
    protected readonly DIFFICULTY_VALUES: string[] = DIFFICULTY_VALUES;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;
    protected readonly MAX_QUESTION_POOL_NAME_LENGTH: number = MAX_QUESTION_POOL_NAME_LENGTH;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;

    createTestForm: FormGroup;

    allTemplates: TestTmplShortInfoModel[];
    testTemplate: TestTemplateModel | null = null;
    selectedTemplateId: string;

    constructor(private fb: FormBuilder,
                private testService: TestApiService,
                private testTemplatesApiService: TestTmplApiService,
                private alertService: AlertService,
                private router: Router
    ) {}

    ngOnInit() {
        this.testTemplatesApiService.getAllTestTmplsShortInfo()
            .pipe(untilDestroyed(this))
            .subscribe((data) => this.allTemplates = data);

        this.createTestForm = this.fb.group({
            testName: ['', [Validators.required, Validators.maxLength(MAX_TEST_NAME_LENGTH)]],
            subject: ['', [Validators.required, Validators.maxLength(MAX_TEST_SUBJECT_LENGTH)]],
            duration: ['', [Validators.required, Validators.min(MIN_TEST_DURATION_VALUE)]],
            difficulty: ['', Validators.required],
            questionPools: this.fb.array([])
        });
    }

    getFormControl(name: string) {
        return this.createTestForm.get(name);
    }

    get questionPoolsFormArray() {
        return this.createTestForm.get('questionPools') as FormArray;
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

    onSubmit() {
        if (this.createTestForm.valid) {
            const questionPools: QuestionPoolCreateDto[] = this.questionPoolsFormArray.controls.map(
                (control, index) => {
                    return {
                        name: control.get('questionPoolName')?.value,
                        numOfQuestionsToBeGenerated: control.get('numOfQuestionsToBeGenerated')?.value,
                        generationStrategy: control.get('generationStrategy')?.value,
                        templateId: this.testTemplate?.questionsPoolTemplates?.at(index)?.id
                    };
                });

            const testCreateDto: TestCreateDto = {
                name: this.createTestForm.value.testName,
                subject: this.createTestForm.value.subject,
                duration: this.createTestForm.value.duration,
                difficulty: this.createTestForm.value.difficulty,
                questionsPools: questionPools,
                templateId: this.testTemplate?.id
            };

            this.testService.createTest(testCreateDto)
                .pipe(untilDestroyed(this))
                .subscribe({
                    next: response => {
                        this.alertService.success('Test created successfully');
                        this.router.navigate(['admin', 'tests', response.id, 'edit']);
                    },
                    error: error => {
                        if(error.status === HttpStatusCode.Conflict) {
                            this.alertService.error('Test with such name already exists');
                            this.createTestForm.controls['testName'].setErrors({'conflict': true})
                        } else {
                            this.alertService.error('Error while creating test');
                        }
                    }
                });
        }
    }


    loadTemplate() {
        if(this.selectedTemplateId) {
            this.testTemplatesApiService.getTestTmplById(this.selectedTemplateId)
                .pipe(untilDestroyed(this))
                .subscribe((data) => {
                    this.testTemplate = data;
                    this.updateFormFields();
                })
        } else {
            this.testTemplate = null;
            this.updateFormFields();
        }
    }

    updateFormFields() {
        this.createTestForm.updateValueAndValidity();

        this.createTestForm.patchValue({
            subject: this.testTemplate?.defaultSubject || '',
            duration: this.testTemplate?.defaultDuration || '',
            difficulty: this.testTemplate?.defaultTestDifficulty || ''
        });

        this.questionPoolsFormArray.clear();

        if(this.testTemplate?.questionsPoolTemplates) {
            this.testTemplate.questionsPoolTemplates.forEach(qpt => {
                this.questionPoolsFormArray.push(this.fb.group({
                    questionPoolName: [
                        qpt?.defaultName || '',
                        [Validators.required, Validators.maxLength(MAX_QUESTION_POOL_NAME_LENGTH)]
                    ],
                    numOfQuestionsToBeGenerated: [
                        qpt?.numOfQuestionsToBeGeneratedRestriction || '',
                        [Validators.required, Validators.min(MIN_NUMBER_OF_QUEST_TO_GENERATE)]
                    ],
                    generationStrategy: [
                        qpt?.generationStrategyRestriction || '',
                        [Validators.required]
                    ]
                }))
            })
        }
    }

    canDeactivate() {
        return !this.createTestForm.dirty;
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
