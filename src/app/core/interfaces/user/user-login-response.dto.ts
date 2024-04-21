import {UserModel} from "./user.model";
import {TokenModel} from "../auth/token.model";

export interface UserLoginResponseDto {
    userData: UserModel,
    tokensPair: TokenModel
}
