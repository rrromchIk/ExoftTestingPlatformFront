import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {TokenModel} from "../../interfaces/auth/token.model";
import {catchError, throwError} from "rxjs";
import {UserLoginDto} from "../../interfaces/user/user-login.dto";
import {UserSignupDto} from "../../interfaces/user/user-signup.dto";
import {UserModel} from "../../interfaces/user/user.model";
import {ResetPasswordDto} from "../../interfaces/auth/reset-password.dto";
import {environment} from "../../../../environments/environment";
import {UserLoginResponseDto} from "../../interfaces/user/user-login-response.dto";

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private apiUrl: string = environment.apiUrl;
    private authEndpoint: string = `${environment.securityUrl}/api/auth`

    constructor(private http: HttpClient) {
    }

    logIn(userLoginDto: UserLoginDto) {
        return this.http.post<UserLoginResponseDto>(this.authEndpoint+ "/login", userLoginDto)
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
        return this.http.post<UserModel>(`${this.apiUrl}/api/users/register`, userSignUpDto)
            .pipe(catchError(err => {
                console.log(err);
                let errMsg = "An error occurred";

                errMsg = err.error.detail

                return throwError(() => new Error(errMsg));
            }))
    }


    forgotPassword(email: string) {
        return this.http.post<HttpResponse<any>>(
            this.authEndpoint + "/password/forgot",
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
            this.authEndpoint + "/password/reset",
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
