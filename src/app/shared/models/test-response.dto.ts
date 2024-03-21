import {BaseResponseDto} from "./base-response.dto";

export interface TestResponseDto extends BaseResponseDto {
    name: string;
    subject: string;
    duration: number;
    isPublished: boolean;
    difficulty: string;
    templateId?: string;
}
