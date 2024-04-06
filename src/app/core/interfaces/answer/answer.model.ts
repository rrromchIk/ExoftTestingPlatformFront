import {BaseModel} from "../base.model";

export interface AnswerModel extends BaseModel {
    questionId: string;
    text: string;
    isCorrect: boolean;
    templateId: string | null;
}
