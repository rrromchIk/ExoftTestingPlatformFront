import {Injectable} from "@angular/core";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {TokenModel} from "../models/token.model";
import {catchError, throwError} from "rxjs";
import {UserLoginDto} from "../models/user-login.dto";
import {UserSignupDto} from "../models/user-signup.dto";
import {UserModel} from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    logIn(userLoginDto: UserLoginDto) {
        return this.http.post<TokenModel>("https://localhost:7297/api/auth/login", userLoginDto)
            .pipe(catchError(err => {
                console.log(err);
                let errMsg = "An error occurred";

                if (err.error.status == HttpStatusCode.Unauthorized)
                    errMsg = "Invalid password";
                else
                    errMsg = err.error.detail

                return throwError(() => new Error(errMsg));
            }))
    }

    signUp(userSignUpDto: UserSignupDto) {
        return this.http.post<UserModel>("https://localhost:7237/api/users/register", userSignUpDto)
            .pipe(catchError(err => {
                console.log(err);
                let errMsg = "An error occurred";

                if (err.error.status == HttpStatusCode.Unauthorized)
                    errMsg = "Invalid password";
                else
                    errMsg = err.error.detail

                return throwError(() => new Error(errMsg));
            }))
    }
}
