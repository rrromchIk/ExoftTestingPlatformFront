export interface UserStatisticModel {
    amountOfStartedTests: number;
    amountOfCompletedTests: number;
    amountOfInProcessTests: number;
    averageResult?: number;
    allTestsResults: number[];
}
