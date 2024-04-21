import {AnswerCreateDto} from "../answer/asnwer-create.dto";

export interface QuestionCreateDto {
    text: string;
    maxScore: number;
    templateId?: string;
    answers: AnswerCreateDto[];
}
