import {BaseResponseDto} from "./base-response.dto";

export interface UserResponseDto extends BaseResponseDto {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureFilePath: string;
    userRole: string;
}
