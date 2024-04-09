import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AuthService} from "../../shared/services/auth.service";

@UntilDestroy()
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
    form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    getFormControl(name: string) {
        return this.form.get(name);
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.forgotPassword(this.form.value.email);
        }
    }
}
