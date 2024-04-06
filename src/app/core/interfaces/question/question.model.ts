import {AnswerModel} from "../answer/answer.model";
import {BaseModel} from "../base.model";

export interface QuestionModel extends BaseModel {
    questionsPoolId: string;
    text: string;
    maxScore: number;
    templateId: string | null;
    answers: AnswerModel[];
}
