export interface UserStatisticModel {
    amountOfStartedTests: number;
    amountOfCompletedTests: number;
    amountOfInProcessTests: number;
    averageResult: number | null; // Assuming average result can be null
    allTestsResults: number[]; // Assuming the results are numeric
}
