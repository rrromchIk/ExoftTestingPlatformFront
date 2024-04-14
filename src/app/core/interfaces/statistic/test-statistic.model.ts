import {TestModel} from "../test/test.model";

export interface TestStatisticModel {
    test: TestModel;
    totalAmountOfAttemptsTaken: number;
    amountOfCurrentGoingAttempts: number;
    averageUsersTimeSpent: number;
    averageUsersScore: number;
    allUsersScores: number[];
}
