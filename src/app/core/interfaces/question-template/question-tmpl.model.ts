import {BaseModel} from "../base.model";
import {AnswerTemplateModel} from "../answer-template/answer-template.model";

export interface QuestionTmplModel extends BaseModel {
    questionsPoolTemplateId: string;
    defaultText?: string;
    maxScoreRestriction?: number;
    answerTemplates?: AnswerTemplateModel[];
}

