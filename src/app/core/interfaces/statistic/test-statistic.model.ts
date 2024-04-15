import {TestModel} from "../test/test.model";

export interface TestStatisticModel {
    test: TestModel;
    totalAmountOfAttemptsTaken: number;
    amountOfCurrentGoingAttempts: number;
    averageUsersTimeSpentInMinutes: number;
    averageUsersResult: number;
    allUsersResults: number[];
}
