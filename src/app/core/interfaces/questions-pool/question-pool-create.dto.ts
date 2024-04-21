export interface QuestionPoolCreateDto {
    name: string;
    numOfQuestionsToBeGenerated: number;
    generationStrategy: string;
    templateId?: string;
}
