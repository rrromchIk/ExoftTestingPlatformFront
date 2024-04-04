import {Injectable} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TokenModel} from "../../core/interfaces/auth/token.model";
import {HttpStatusCode} from "@angular/common/http";
import {UserModel} from "../../core/interfaces/user/user.model";
import {AuthApiService} from "../../core/services/api/auth.api.service";
import {UserLoginDto} from "../../core/interfaces/user/user-login.dto";
import {AlertService} from "./alert.service";
import {Router} from "@angular/router";
import {UserSignupDto} from "../../core/interfaces/user/user-signup.dto";
import {ResetPasswordDto} from "../../core/interfaces/auth/reset-password.dto";
import {BehaviorSubject, finalize, Observable, of, tap} from "rxjs";
import {LoaderService} from "./loader.service";

@UntilDestroy()
@Injectable({
    providedIn: "root"
})
export class AuthService {
    constructor(private authApiService: AuthApiService,
                private alertService: AlertService,
                private router: Router,
                private loaderService: LoaderService) {
    }

    private currentUserSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);
    public currentUser$: Observable<UserModel | null> = this.currentUserSubject.asObservable();

    logIn(userLoginDto: UserLoginDto) {
        this.loaderService.showLoading(true);

        this.authApiService.logIn(userLoginDto)
            .pipe(
                untilDestroyed(this),
                finalize(() => {
                    this.loaderService.showLoading(false);
                })
            )
            .subscribe({
                    next: (data) => {
                        this.setCurrentUser(data.userData);
                        this.setTokensPair(data.tokensPair);

                        if (data.userData.role === 'Admin' || data.userData.role === 'SuperAdmin')
                            this.router.navigate(['/admin']);
                        else
                            this.router.navigate(['/user-main']);
                    },
                    error: (err) => {
                        let errMsg: string;

                        if (err.error.status == HttpStatusCode.Unauthorized)
                            errMsg = "Invalid password";
                        else
                            errMsg = err.error.detail

                        this.alertService.error(errMsg);
                    }
                }
            )
    }


    signUp(userSignUpDto: UserSignupDto) {
        this.loaderService.showLoading(true);

        this.authApiService.signUp(userSignUpDto)
            .pipe(
                untilDestroyed(this),
                finalize(() => {
                    this.loaderService.showLoading(false);
                })
            )
            .subscribe({
                next: () => {
                    this.alertService.success("Sign up success");
                    this.router.navigate(['/login']);
                },
                error: err => {
                    this.alertService.error(err.error.detail);
                }
            })
    }

    forgotPassword(email: string) {
        this.loaderService.showLoading(true);

        this.authApiService.forgotPassword(email)
            .pipe(
                untilDestroyed(this),
                finalize(() => {
                    this.loaderService.showLoading(false);
                })
            )
            .subscribe({
                next: () => {
                    this.alertService.success("Email sent success");
                },
                error: (err) => {
                    this.alertService.error(err.error.detail);
                }
            })
    }

    resetPassword(resetPasswordDto: ResetPasswordDto) {
        this.loaderService.showLoading(true);

        this.authApiService.resetPassword(resetPasswordDto)
            .pipe(
                untilDestroyed(this),
                finalize(() => {
                    this.loaderService.showLoading(false);
                })
            )
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successfully');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.alertService.error(err.error.detail);
                }
            });
    }

    refreshToken() {
        const tokensModel = this.getTokensPair();

        if (tokensModel) {
            return this.authApiService.refreshToken(tokensModel)
                .pipe(
                    tap(data => {
                        console.log("refreshing tokens")
                        this.setTokensPair(data);
                    })
                )
        } else {
            return of();
        }
    }

    logout() {
        console.log("logout");
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tokensPair');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login'])
    }

    setCurrentUser(user: UserModel): void {
        console.log("setting user to localstorage");
        console.log(user);
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    setTokensPair(tokens: TokenModel): void {
        console.log("setting tokens to localstorage");
        console.log(tokens);
        localStorage.setItem('tokensPair', JSON.stringify(tokens));
    }

    getCurrentUser(): UserModel | null {
        const currentUser = localStorage.getItem('currentUser')
        return currentUser != null ? JSON.parse(currentUser) : null;
    }

    getTokensPair(): TokenModel | null {
        const tokens = localStorage.getItem('tokensPair');
        return tokens != null ? JSON.parse(tokens) : null;
    }
}
