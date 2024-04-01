import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/api/auth.api.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
    errorMessage: string | null = null;
    emailSentSuccess: boolean | null = null;
    form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    getFormControl(name: string) {
        return this.form.get(name);
    }

    onSubmit() {
        this.errorMessage = null;
        if(this.form.valid) {
            this.authService.forgotPassword(this.form.value.email).subscribe(
                res => {
                    console.log(res)
                    this.emailSentSuccess = true;
                },
                error => {
                    this.errorMessage = error;
                    this.emailSentSuccess = false;
                }
            )
        }
    }
}
