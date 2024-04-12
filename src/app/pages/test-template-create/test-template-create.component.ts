import {Component, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../shared/services/alert.service";
import {Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
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
import {TestTmplApiService} from "../../core/services/api/test-tmpl.api.service";
import {QuestionsPoolTmplDto} from "../../core/interfaces/questions-pool-tmpl/quest-pool-tmpl.dto";
import {HttpStatusCode} from "@angular/common/http";
import {CanDeactivateComponent} from "../../core/guards/guards";

@UntilDestroy()
@Component({
  selector: 'app-test-template-create',
  templateUrl: './test-template-create.component.html',
  styleUrl: './test-template-create.component.scss'
})
export class TestTemplateCreateComponent implements CanDeactivateComponent {
    protected readonly MAX_TEST_NAME_LENGTH: number = MAX_TEST_NAME_LENGTH;
    protected readonly MAX_TEST_SUBJECT_LENGTH: number = MAX_TEST_SUBJECT_LENGTH;
    protected readonly MIN_TEST_DURATION_VALUE: number = MIN_TEST_DURATION_VALUE;
    protected readonly DIFFICULTY_VALUES: string[] = DIFFICULTY_VALUES;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;
    protected readonly MAX_QUESTION_POOL_NAME_LENGTH: number = MAX_QUESTION_POOL_NAME_LENGTH;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;

    createTestTmplForm: FormGroup;

    constructor(private fb: FormBuilder,
                private testTemplateApiService: TestTmplApiService,
                private alertService: AlertService,
                private router: Router
    ) {}

    ngOnInit() {
        this.createTestTmplForm = this.fb.group({
            templateName: ['', [Validators.required, Validators.maxLength(MAX_TEST_NAME_LENGTH)]],
            defaultSubject: ['', [Validators.maxLength(MAX_TEST_SUBJECT_LENGTH)]],
            defaultDuration: ['', [Validators.min(MIN_TEST_DURATION_VALUE)]],
            defaultDifficulty: [''],
            questionPoolTemplates: this.fb.array([])
        });
    }

    getFormControl(name: string) {
        return this.createTestTmplForm.get(name);
    }

    get questionPoolTemplatesFormArray() {
        return this.createTestTmplForm.get('questionPoolTemplates') as FormArray;
    }

    addQuestionPoolTemplateFormGroup() {
        this.questionPoolTemplatesFormArray.push(this.fb.group({
            defaultName: ['', [Validators.maxLength(MAX_QUESTION_POOL_NAME_LENGTH)]],
            numOfQuestionsToBeGeneratedRestriction: ['', [Validators.min(MIN_NUMBER_OF_QUEST_TO_GENERATE)]],
            generationStrategyRestriction: ['']
        }));
    }

    removeQuestionPoolTemplateFormGroup(index: number) {
        this.questionPoolTemplatesFormArray.removeAt(index);
    }

    onSubmit() {
        if (this.createTestTmplForm.valid) {
            const testTmplCreateDto = this.createTestTmplDtoFromForm();
            this.testTemplateApiService.createTestTemplate(testTmplCreateDto)
                .pipe(untilDestroyed(this))
                .subscribe({
                    next: response => {
                        this.alertService.success('Template created successfully');
                        this.router.navigate(['admin', 'test-templates', response.id, 'edit']);
                    },
                    error: error => {
                        console.log(error);
                        if(error.status === HttpStatusCode.Conflict) {
                            this.alertService.error('Template with such name already exists');
                            this.createTestTmplForm.controls['templateName'].setErrors({'conflict': true})
                        } else {
                            this.alertService.error('Error while creating template');
                        }
                    }
                });
        }
    }


    private createTestTmplDtoFromForm() {
        const templateName = this.createTestTmplForm.value.templateName;
        const defaultSubject = this.createTestTmplForm.value.defaultSubject;
        const defaultDuration = this.createTestTmplForm.value.defaultDuration;
        const defaultTestDifficulty = this.createTestTmplForm.value.defaultTestDifficulty;

        const questionPoolsTmpl: QuestionsPoolTmplDto[] = this.questionPoolTemplatesFormArray.controls.map(
            control => {
                const defaultName = control.value.defaultName;
                const numOfQuestRestr = control.value.numOfQuestionsToBeGeneratedRestriction;
                const genStrategyRestr = control.value.generationStrategyRestriction;

                return {
                    defaultName: defaultName !== '' ? defaultName : null,
                    numOfQuestionsToBeGeneratedRestriction: numOfQuestRestr != '' ? numOfQuestRestr : null,
                    generationStrategyRestriction: genStrategyRestr !== '' ? genStrategyRestr : null
                };
            });

        return {
            templateName: templateName,
            defaultSubject: defaultSubject !== '' ? defaultSubject : null,
            defaultDuration: defaultDuration !== '' ? defaultDuration : null,
            defaultTestDifficulty: defaultTestDifficulty !== '' ? defaultTestDifficulty : null,
            questionsPoolTemplates: questionPoolsTmpl
        };
    }

    canDeactivate() {
        return !this.createTestTmplForm.dirty;
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
