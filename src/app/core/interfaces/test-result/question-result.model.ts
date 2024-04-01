import {AnswerResultModel} from "./answer-result.model";

export interface QuestionResultModel {
    id: string;
    questionText: string;
    maxScore: number;
    userScore: number;
    answersResults: AnswerResultModel[];
}
