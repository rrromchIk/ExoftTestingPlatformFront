import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {UserLoginDto} from "../../interfaces/user/user-login.dto";
import {UserSignupDto} from "../../interfaces/user/user-signup.dto";
import {UserModel} from "../../interfaces/user/user.model";
import {ResetPasswordDto} from "../../interfaces/auth/reset-password.dto";
import {environment} from "../../../../environments/environment";
import {UserLoginResponseDto} from "../../interfaces/user/user-login-response.dto";
import {TokenModel} from "../../interfaces/auth/token.model";
import {ChangePasswordDto} from "../../interfaces/auth/change-password.dto";

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private apiUrl: string = environment.apiUrl;
    private authEndpoint: string = `${environment.securityUrl}/api/auth`

    constructor(private http: HttpClient) {}

    logIn(userLoginDto: UserLoginDto) {
        return this.http.post<UserLoginResponseDto>(this.authEndpoint+ "/login", userLoginDto);
    }

    register(userSignUpDto: UserSignupDto) {
        return this.http.post<UserModel>(`${this.apiUrl}/api/users/register`, userSignUpDto);
    }

    registerAdmin(userSignUpDto: UserSignupDto) {
        return this.http.post<UserModel>(`${this.apiUrl}/api/users/register/admin`, userSignUpDto);
    }

    forgotPassword(email: string) {
        return this.http.post(this.authEndpoint + "/password/forgot", { email });
    }

    resetPassword(resetPasswordDto: ResetPasswordDto) {
        return this.http.post(this.authEndpoint + "/password/reset", resetPasswordDto);
    }

    refreshToken(tokens: TokenModel) {
        return this.http.post<TokenModel>(this.authEndpoint + "/refresh", tokens);
    }

    confirmEmail(userId: string, token: string) {
        return this.http.post(`${this.apiUrl}/api/users/email/confirm`, {userId, token});
    }

    confirmEmailRequest() {
        return this.http.get(`${this.authEndpoint}/email/confirm/request`);
    }

    changePassword(changePasswordDto: ChangePasswordDto) {
        return this.http.post(`${this.authEndpoint}/password/change`, changePasswordDto)
    }
}
