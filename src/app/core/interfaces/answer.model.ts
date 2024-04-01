export interface AnswerModel {
    questionId: string;
    text: string;
    isCorrect: boolean;
    templateId: string | null;
}
