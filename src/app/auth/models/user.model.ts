import {BaseModel} from "../../shared/models/base.model";

export interface UserModel extends BaseModel {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    emailConfirmed: true,
    userRole: string
    profilePictureFilePath: string,
}
