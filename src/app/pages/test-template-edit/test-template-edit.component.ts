import {Component} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    MAX_QUESTION_POOL_NAME_LENGTH,
    MAX_TEST_NAME_LENGTH,
    MAX_TEST_SUBJECT_LENGTH, MIN_NUMBER_OF_QUEST_TO_GENERATE,
    MIN_TEST_DURATION_VALUE
} from "../../core/constants/validation.constants";
import {DIFFICULTY_VALUES, GENERATION_STRATEGIES_VALUES} from "../../core/constants/view.constants";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {filter} from "rxjs";
import {TestTemplateModel} from "../../core/interfaces/test-template/test-template.model";
import {TestTmplEditPageService} from "./test-tmpl-edit.page.service";
import {TestTmplUpdateDto} from "../../core/interfaces/test-template/test-tmpl-update.dto";
import {QuestionsPoolTmplModel} from "../../core/interfaces/questions-pool-tmpl/questions-pool-tmpl.model";
import {QuestionsPoolTmplCreateDto} from "../../core/interfaces/questions-pool-tmpl/qp-tmpl-create.dto";
import {AlertService} from "../../shared/services/alert.service";

@UntilDestroy()
@Component({
    selector: 'app-test-template-edit',
    templateUrl: './test-template-edit.component.html',
    styleUrl: './test-template-edit.component.scss',
    providers: [TestTmplEditPageService]
})
export class TestTemplateEditComponent {
    protected readonly MAX_TEST_NAME_LENGTH: number = MAX_TEST_NAME_LENGTH;
    protected readonly MAX_TEST_SUBJECT_LENGTH: number = MAX_TEST_SUBJECT_LENGTH;
    protected readonly MIN_TEST_DURATION_VALUE: number = MIN_TEST_DURATION_VALUE;
    protected readonly DIFFICULTY_VALUES: string[] = DIFFICULTY_VALUES;
    protected readonly GENERATION_STRATEGIES_VALUES: string[] = GENERATION_STRATEGIES_VALUES;
    protected readonly MIN_NUMBER_OF_QUEST_TO_GENERATE: number = MIN_NUMBER_OF_QUEST_TO_GENERATE;
    protected readonly MAX_QUESTION_POOL_NAME_LENGTH: number = MAX_QUESTION_POOL_NAME_LENGTH;

    testTemplate: TestTemplateModel
    editTestTmplForm: FormGroup;
    testTmplDataChanges: boolean = false;

    questionsPoolTmplsFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private testTmplEditPageService: TestTmplEditPageService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.editTestTmplForm = this.fb.group({
            templateName: ['', [Validators.required, Validators.maxLength(MAX_TEST_NAME_LENGTH)]],
            defaultSubject: ['', [Validators.maxLength(MAX_TEST_SUBJECT_LENGTH)]],
            defaultDuration: ['', [Validators.min(MIN_TEST_DURATION_VALUE)]],
            defaultTestDifficulty: [''],
        });

        this.questionsPoolTmplsFormGroup = this.fb.group({
            questionPoolTemplates: this.fb.array([])
        })

        const testTmplId = this.route.snapshot.params['id'];

        this.testTmplEditPageService.getTestTmplById(testTmplId);

        this.testTmplEditPageService.testTemplate$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if (data) {
                        this.testTemplate = data;

                        this.setTestTmplDataToFormFields();

                        const initialFormValues = {...this.editTestTmplForm.value};
                        this.editTestTmplForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.testTmplDataChanges = this.isTestTmplFormChanged(initialFormValues);
                            });
                    }
                },
                error: () => {
                    this.editTestTmplForm.controls['templateName'].setErrors({'conflict': true})
                }
            });
    }

    getFormControl(name: string) {
        return this.editTestTmplForm.get(name);
    }

    setTestTmplDataToFormFields() {
        this.editTestTmplForm.patchValue({
            templateName: this.testTemplate.templateName,
            defaultSubject: this.testTemplate.defaultSubject,
            defaultDuration: this.testTemplate.defaultDuration,
            defaultTestDifficulty: this.testTemplate.defaultTestDifficulty,
        })

        this.testTmplDataChanges = false;
    }

    isTestTmplFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editTestTmplForm.value);
    }

    updateTestTmpl() {
        if (this.editTestTmplForm.valid) {
            const templateName = this.editTestTmplForm.value.templateName;
            const defaultSubject = this.editTestTmplForm.value.defaultSubject;
            const defaultDuration = this.editTestTmplForm.value.defaultDuration;
            const defaultTestDifficulty = this.editTestTmplForm.value.defaultTestDifficulty;


            const testTmplUpdateDto: TestTmplUpdateDto = {
                templateName: templateName,
                defaultSubject: defaultSubject !== '' ? defaultSubject : null,
                defaultDuration: defaultDuration !== '' ? defaultDuration : null,
                defaultTestDifficulty: defaultTestDifficulty !== '' ? defaultTestDifficulty : null,
            };

            this.testTmplEditPageService.updateTestTemplate(this.testTemplate.id, testTmplUpdateDto);
        }
    }

    get questionPoolTmplsFormArray() {
        return this.questionsPoolTmplsFormGroup.get('questionPoolTemplates') as FormArray;
    }

    addQuestionPoolTmplFormGroup() {
        this.questionPoolTmplsFormArray.push(this.fb.group({
            defaultName: ['', [Validators.maxLength(MAX_QUESTION_POOL_NAME_LENGTH)]],
            numOfQuestionsToBeGeneratedRestriction: ['', [Validators.min(MIN_NUMBER_OF_QUEST_TO_GENERATE)]],
            generationStrategyRestriction: ['']
        }));
    }

    removeQuestionPoolTmplFormGroup(index: number) {
        this.questionPoolTmplsFormArray.removeAt(index);
    }

    saveQuestionPoolTmpl(index: number, control: AbstractControl) {
        const defaultName = control.value.defaultName;
        const numOfQuestRestr = control.value.numOfQuestionsToBeGeneratedRestriction;
        const genStrategyRestr = control.value.generationStrategyRestriction;

        const questionPoolDto: QuestionsPoolTmplCreateDto = {
            defaultName: defaultName !== '' ? defaultName : null,
            numOfQuestionsToBeGeneratedRestriction: numOfQuestRestr != '' ? numOfQuestRestr : null,
            generationStrategyRestriction: genStrategyRestr !== '' ? genStrategyRestr : null
        };

        this.questionPoolTmplsFormArray.removeAt(index);
        this.testTmplEditPageService.createQuestionPoolTemplate(this.testTemplate.id, questionPoolDto);
    }

    deleteQuestionsPoolTmpl(questionsPoolTmpl: QuestionsPoolTmplModel) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete questions pool template?',
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
            .subscribe(() => this.testTmplEditPageService.deleteQuestionsPoolTmpl(questionsPoolTmpl));
    }
}
