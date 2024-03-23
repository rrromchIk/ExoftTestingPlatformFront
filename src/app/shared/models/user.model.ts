import {BaseModel} from "./base.model";

export interface UserModel extends BaseModel {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureFilePath: string;
    userRole: string;
}
