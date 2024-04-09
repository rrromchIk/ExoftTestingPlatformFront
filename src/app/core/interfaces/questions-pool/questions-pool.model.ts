import {BaseModel} from "../base.model";

export interface QuestionsPoolModel extends BaseModel {
    testId: string;
    name: string;
    numOfQuestionsToBeGenerated: number;
    templateId?: string;
    generationStrategy: string;
}
