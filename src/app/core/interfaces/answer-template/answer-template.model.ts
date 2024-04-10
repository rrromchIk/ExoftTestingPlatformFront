import {BaseModel} from "../base.model";

export interface AnswerTemplateModel extends BaseModel {
    questionTemplateId: string;
    defaultText?: string;
    isCorrectRestriction: boolean;
}
