import {BehaviorSubject, Observable} from "rxjs";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {HttpStatusCode} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TestTemplateModel} from "../../core/interfaces/test-template/test-template.model";
import {TestTmplApiService} from "../../core/services/api/test-tmpl.api.service";
import {TestTmplUpdateDto} from "../../core/interfaces/test-template/test-tmpl-update.dto";
import {QuestionsPoolTmplCreateDto} from "../../core/interfaces/questions-pool-tmpl/qp-tmpl-create.dto";
import {QuestionsPoolTmplApiService} from "../../core/services/api/questions-pool-tmpl.api.service";
import {QuestionsPoolTmplModel} from "../../core/interfaces/questions-pool-tmpl/questions-pool-tmpl.model";

@UntilDestroy()
@Injectable()
export class TestTmplEditPageService {
    private testTmplSubject: BehaviorSubject<TestTemplateModel | null> = new BehaviorSubject<TestTemplateModel | null>(null);
    public testTemplate$: Observable<TestTemplateModel  | null> = this.testTmplSubject.asObservable();

    constructor(private alertService: AlertService,
                private testTmplApiService: TestTmplApiService,
                private questionsPoolTmplApiService: QuestionsPoolTmplApiService
    ) {}

    getTestTmplById(testTmplId: string) {
        this.testTmplApiService.getTestTmplById(testTmplId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.testTmplSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting test template");
                }
            })
    }


    updateTestTemplate(testId: string, testTmplToUpdate: TestTmplUpdateDto) {
        this.testTmplApiService.updateTestTmpl(testId, testTmplToUpdate)
            .pipe(untilDestroyed(this))
            .subscribe({
                    next: () => {
                        this.alertService.success("Test template updated successfully");

                        const currentTestTmpl = this.testTmplSubject.getValue();
                        if(currentTestTmpl) {
                            currentTestTmpl.templateName = testTmplToUpdate.templateName;
                            currentTestTmpl.defaultSubject = testTmplToUpdate.defaultSubject;
                            currentTestTmpl.defaultDuration = testTmplToUpdate.defaultDuration;
                            currentTestTmpl.defaultTestDifficulty = testTmplToUpdate.defaultTestDifficulty;
                            this.testTmplSubject.next(currentTestTmpl);
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        if (error.status === HttpStatusCode.Conflict) {
                            this.alertService.error('Test template with such name already exists');
                            this.testTmplSubject.error(new Error());
                        } else {
                            this.alertService.error("Unable to update test template");
                        }

                        this.testTmplSubject.next(this.testTmplSubject.getValue());
                    }
                }
            )
    }

    createQuestionPoolTemplate(testTmplId: string, questionPoolTmplDto: QuestionsPoolTmplCreateDto) {
        this.questionsPoolTmplApiService.createQuestionsPoolTmpl(testTmplId, questionPoolTmplDto)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.alertService.success("Questions pool template saved successfully");

                    const currentTestTmpl = this.testTmplSubject.getValue();

                    if(currentTestTmpl) {
                        currentTestTmpl.questionsPoolTemplates!.push(data);
                        this.testTmplSubject.next(currentTestTmpl);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to save questions pool template");
                }
            })
    }

    deleteQuestionsPoolTmpl(questionsPoolTmpl: QuestionsPoolTmplModel) {
        this.questionsPoolTmplApiService.deleteQuestionsPoolTmpl(questionsPoolTmpl.id)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("Questions pool template deleted successfully");

                    const currentTestTmpl = this.testTmplSubject.getValue();

                    if(currentTestTmpl) {
                        currentTestTmpl.questionsPoolTemplates = currentTestTmpl.questionsPoolTemplates!
                            .filter(qp => qp.id !== questionsPoolTmpl.id);

                        this.testTmplSubject.next(currentTestTmpl);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to delete questions pool template");
                }
            })
    }
}
