import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/api/auth.api.service";
import {passwordsMatchValidator} from "../../../core/helpers/form-validators";
import {ActivatedRoute} from "@angular/router";
import {ResetPasswordDto} from "../../../core/interfaces/auth/reset-password.dto";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    errorMessage: string | null = null;
    form!: FormGroup;
    hidePassword: boolean = true;
    userId!: string | null;
    changePasswordToken!: string | null;


    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            password: ['', [Validators.required,
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'),
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
        this.errorMessage = null;
        if(this.form.valid) {
            if(this.userId && this.changePasswordToken) {
                const resetPasswordDto: ResetPasswordDto = {
                    userId: this.userId,
                    token: this.changePasswordToken,
                    newPassword: this.form.value.password
                }
                this.authService.resetPassword(resetPasswordDto).subscribe(
                    res => {
                        console.log(res)
                        this.errorMessage = null;
                    },
                    error => {
                        this.errorMessage = error
                    }
                )
            } else {
                this.errorMessage = "Invalid link"
            }
        }
    }
}
