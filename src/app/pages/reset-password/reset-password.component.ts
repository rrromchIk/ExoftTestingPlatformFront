import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordsMatchValidator} from "../../core/helpers/form-validators";
import {ActivatedRoute, Router} from "@angular/router";
import {ResetPasswordDto} from "../../core/interfaces/auth/reset-password.dto";
import {PASSWORD_PATTERN} from "../../core/constants/validation.constants";
import {AlertService} from "../../shared/services/alert.service";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AuthService} from "../../shared/services/auth.service";

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
        private route: ActivatedRoute,
        private alertService: AlertService,
        private authService: AuthService
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
                this.authService.resetPassword(resetPasswordDto);
            } else {
                this.alertService.error("Invalid link");
            }
        }
    }
}
