import {BaseModel} from "../base.model";
import {QuestionsPoolTmplModel} from "../questions-pool-tmpl/questions-pool-tmpl.model";

export interface TestTemplateModel extends BaseModel {
    templateName: string;
    defaultTestDifficulty?: string;
    defaultSubject?: string;
    defaultDuration?: number;
    questionsPoolTemplates?: QuestionsPoolTmplModel[]
}
