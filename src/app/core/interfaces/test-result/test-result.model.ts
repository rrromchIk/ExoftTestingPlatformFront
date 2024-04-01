import {QuestionResultModel} from "./question-result.model";

export interface TestResultModel {
    userId: string;
    testId: string;
    totalScore: number;
    userScore: number;
    startingTime: Date;
    endingTime: Date;
    userTestStatus: string;
    questionsResults: QuestionResultModel[];
}
