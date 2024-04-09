import {QuestionsPoolTmplDto} from "../questions-pool-tmpl/quest-pool-tmpl.dto";

export interface TestTemplateCreateDto {
    templateName: string;
    defaultTestDifficulty?: string;
    defaultSubject?: string;
    defaultDuration?: number;
    questionsPoolTemplates?: QuestionsPoolTmplDto[]
}
