import {BaseModel} from "./base.model";

export interface TestTemplateModel extends BaseModel {
    templateName: string;
    defaultTestDifficulty?: string;
    defaultSubject?: string;
    defaultDuration?: number;
}
