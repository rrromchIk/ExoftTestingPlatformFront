import {Injectable} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {BehaviorSubject} from "rxjs";
import {TokenModel} from "../../core/interfaces/auth/token.model";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../core/interfaces/user/user.model";

@UntilDestroy()
@Injectable({
    providedIn: "root"
})
export class AuthService {
    constructor(private httpClient: HttpClient) {

    }


    getUser(): UserModel {
        return {
            createdBy: "",
            createdTimestamp: new Date(),
            email: "mashavinnikova2004@gmail.com",
            emailConfirmed: false,
            firstName: "Masha",
            id: "f9884071-88d7-46af-d332-08dc45be50ce",
            lastName: "Vinnikova",
            profilePictureFilePath: "",
            userRole: "Admin"
        }
    }
}
