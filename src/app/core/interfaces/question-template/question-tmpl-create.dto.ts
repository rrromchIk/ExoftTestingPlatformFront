import {AnswerTemplateDto} from "../answer-template/answer-template.dto";

export interface QuestionTmplCreateDto {
    defaultText?: string;
    maxScoreRestriction?: number;
    answerTemplates?: AnswerTemplateDto[];
}
