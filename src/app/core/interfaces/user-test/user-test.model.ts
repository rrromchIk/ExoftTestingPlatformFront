import {TestModel} from "../test/test.model";

export interface UserTestModel {
    userId: string;
    test: TestModel
    totalScore: number;
    userScore: number;
    startingTime: Date;
    endingTime: Date;
    userTestStatus: string;
}
