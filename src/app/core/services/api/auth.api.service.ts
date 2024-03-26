import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {TokenModel} from "../../interfaces/token.model";
import {catchError, throwError} from "rxjs";
import {UserLoginDto} from "../../interfaces/user-login.dto";
import {UserSignupDto} from "../../interfaces/user-signup.dto";
import {UserModel} from "../../interfaces/user.model";
import {ResetPasswordDto} from "../../interfaces/reset-password.dto";

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

                errMsg = err.error.detail

                return throwError(() => new Error(errMsg));
            }))
    }


    forgotPassword(email: string) {
        return this.http.post<HttpResponse<any>>(
            "https://localhost:7297/api/auth/password/forgot",
            {
                email
            }, {
                observe: 'response'
            }).pipe(catchError(err => {
            console.log(err);

            let errMsg = err.error.detail;
            return throwError(() => new Error(errMsg));
        }))
    }


    resetPassword(resetPasswordDto: ResetPasswordDto) {
        return this.http.post<HttpResponse<any>>(
            "https://localhost:7297/api/auth/password/reset",
            resetPasswordDto,
            {
                observe: 'response'
            }).pipe(catchError(err => {
            console.log(err);

            let errMsg = err.error.detail;
            return throwError(() => new Error(errMsg));
        }))
    }
}
