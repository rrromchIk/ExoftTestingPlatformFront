import {QuestionPoolCreateDto} from "./question-pool-create.dto";

export interface TestCreateDto {
    name: string;
    subject: string;
    duration: number;
    difficulty: string;
    templateId?: string;
    questionsPools?: QuestionPoolCreateDto[];
}
