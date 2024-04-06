export interface AnswerCreateDto {
    text: string;
    isCorrect: boolean;
    templateId?: string | null;
}
