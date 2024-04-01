import {Component} from '@angular/core';
import {UserModel} from "../../../core/interfaces/user/user.model";
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
} from "../../../core/constants/validation.constants";

import {
    DIFFICULTY_VALUES,
    GENERATION_STRATEGIES_VALUES
} from "../../../core/constants/view.constants";
import {TestService} from "../../../core/services/api/test.api.service";
import {TestCreateDto} from "../../../core/interfaces/test/test-create.dto";
import {QuestionPoolCreateDto} from "../../../core/interfaces/questions-pool/question-pool-create.dto";

@Component({
    selector: 'app-test-create',
    templateUrl: './test-create.component.html',
    styleUrl: './test-create.component.scss'
})
export class TestCreateComponent {
    protected readonly MAX_TEST_NAME_LENGTH: number = MAX_TEST_NAME_LENGTH;
    protected readonly MAX_TEST_SUBJECT_LENGTH: number = MAX_TEST_SUBJECT_LENGTH;
    protected readonly MIN_TEST_DURATION_VALUE: number = MIN_TEST_DURATION_VALUE;
    protected readonly DIFFICULTY_VALUES: string[] = DIFFICULTY_VALUES;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;

    user!: UserModel;
    createTestForm!: FormGroup;

    constructor(private fb: FormBuilder, private testService: TestService) {
    }

    ngOnInit() {
        this.createTestForm = this.fb.group({
            testName: ['', [Validators.required, Validators.maxLength(MAX_TEST_NAME_LENGTH)]],
            subject: ['', [Validators.required, Validators.maxLength(MAX_TEST_NAME_LENGTH)]],
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
                control => {
                    return {
                        name: control.get('questionPoolName')?.value,
                        numOfQuestionsToBeGenerated: control.get('numOfQuestionsToBeGenerated')?.value,
                        generationStrategy: control.get('generationStrategy')?.value
                    };
                });

            const testCreateDto: TestCreateDto = {
                name: this.createTestForm.value.testName,
                subject: this.createTestForm.value.subject,
                duration: this.createTestForm.value.duration,
                difficulty: this.createTestForm.value.difficulty,
                questionsPools: questionPools
            };

            console.log(testCreateDto);

            this.testService.createTest(testCreateDto)
                .subscribe(response => {
                    console.log(response);
                }, error => {
                    console.log(error);
                });
        }
    }
}
