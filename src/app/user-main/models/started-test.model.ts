import {TestModel} from "../../admin-main/models/test.model";

export interface StartedTestModel {

    test: TestModel,
    totalScore: number,
    userScore: number,
    startingTime: Date,
    endingTime: Date,
    userTestStatus: string
}

