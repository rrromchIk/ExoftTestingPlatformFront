import {QuestionsPoolTmplCreateDto} from "../questions-pool-tmpl/qp-tmpl-create.dto";

export interface TestTemplateCreateDto {
    templateName: string;
    defaultTestDifficulty?: string;
    defaultSubject?: string;
    defaultDuration?: number;
    questionsPoolTemplates?: QuestionsPoolTmplCreateDto[]
}
