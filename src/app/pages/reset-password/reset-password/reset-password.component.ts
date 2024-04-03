import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthApiService} from "../../../core/services/api/auth.api.service";
import {passwordsMatchValidator} from "../../../core/helpers/form-validators";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {ResetPasswordDto} from "../../../core/interfaces/auth/reset-password.dto";
import {PASSWORD_PATTERN} from "../../../core/constants/validation.constants";
import {AlertService} from "../../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    form!: FormGroup;
    hidePassword: boolean = true;
    userId!: string | null;
    changePasswordToken!: string | null;


    constructor(
        private fb: FormBuilder,
        private authService: AuthApiService,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            password: ['', [Validators.required,
                Validators.pattern(PASSWORD_PATTERN),
                passwordsMatchValidator('confirmPassword', true)]],
            confirmPassword: ['', [Validators.required, passwordsMatchValidator('password')]]
        });

        this.userId = this.route.snapshot.queryParamMap.get('userId');
        this.changePasswordToken = this.route.snapshot.queryParamMap.get('token');

        console.log(this.userId);
        console.log(this.changePasswordToken);
    }

    getFormControl(name: string) {
        return this.form.get(name);
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.userId && this.changePasswordToken) {
                const resetPasswordDto: ResetPasswordDto = {
                    userId: this.userId,
                    token: this.changePasswordToken,
                    newPassword: this.form.value.password
                }
                this.authService.resetPassword(resetPasswordDto)
                    .pipe(untilDestroyed(this))
                    .subscribe({
                        next: () => {
                            this.alertService.success('Password reset successfully');
                            this.router.navigate(['/login']);
                        },
                        error: (error) => {
                            this.alertService.error(error);
                        }
                    }
                )
            } else {
                this.alertService.error("Invalid link");
            }
        }
    }
}
