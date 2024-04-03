import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthApiService} from "../../../core/services/api/auth.api.service";
import {Router} from "@angular/router";
import {UserLoginDto} from "../../../core/interfaces/user/user-login.dto";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {catchError, of, tap} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {AlertService} from "../../../shared/services/alert.service";

@UntilDestroy()
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    hidePassword: boolean = true;
    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authApiService: AuthApiService,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    getFormControl(name: string) {
        return this.loginForm.get(name);
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const userLoginDto: UserLoginDto = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password
            }

            this.authApiService.logIn(userLoginDto)
                .pipe(
                    untilDestroyed(this),
                    tap(data => {
                        this.authService.setCurrentUser(data.userData);
                        this.authService.setTokensPair(data.tokensPair);
                        this.router.navigate(['/']);
                    }),
                    catchError(err => {
                        this.alertService.error(err);
                        return of(null);
                    })
                )
                .subscribe()
        }
    }
}
