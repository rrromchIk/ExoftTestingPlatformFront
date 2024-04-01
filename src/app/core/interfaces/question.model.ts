import {AnswerModel} from "./answer.model";

export interface QuestionModel  {
    questionsPoolId: string;
    text: string;
    maxScore: number;
    templateId: string | null;
    answers: AnswerModel[];
}
