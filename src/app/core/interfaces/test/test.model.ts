import {BaseModel} from "../base.model";
import {QuestionsPoolModel} from "../questions-pool/questions-pool.model";

export interface TestModel extends BaseModel {
    name: string;
    subject: string;
    duration: number;
    isPublished: boolean;
    difficulty: string;
    templateId?: string;
    questionsPools: QuestionsPoolModel[];
}
