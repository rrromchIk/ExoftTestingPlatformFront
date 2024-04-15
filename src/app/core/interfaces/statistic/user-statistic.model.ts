export interface UserStatisticModel {
    amountOfStartedTests: number;
    amountOfCompletedTests: number;
    amountOfInProcessTests: number;
    totalTimeSpentInMinutes: number;
    averageResult?: number;
    allTestsResults: number[];
}
