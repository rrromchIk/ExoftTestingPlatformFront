import {BaseModel} from "../../shared/models/base.model";

export interface TestModel extends BaseModel {
    name: string;
    subject: string;
    duration: number;
    isPublished: boolean;
    difficulty: string;
    templateId?: string;
}
