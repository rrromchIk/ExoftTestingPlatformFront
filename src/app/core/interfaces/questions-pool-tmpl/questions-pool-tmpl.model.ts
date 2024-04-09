import {BaseModel} from "../base.model";

export interface QuestionsPoolTmplModel extends BaseModel {
    testTemplateId: string;
    defaultName?: string;
    numOfQuestionsToBeGeneratedRestriction?: number;
    generationStrategyRestriction?: string;
}
