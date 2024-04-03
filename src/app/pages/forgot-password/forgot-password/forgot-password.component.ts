import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthApiService} from "../../../core/services/api/auth.api.service";
import {AlertService} from "../../../shared/services/alert.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

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
        private authService: AuthApiService,
        private alertService: AlertService
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
            this.authService.forgotPassword(this.form.value.email)
                .pipe(untilDestroyed(this))
                .subscribe({
                    next: () => {
                        this.alertService.success("Email sent success");
                    },
                    error: (error) => {
                        this.alertService.error(error);
                    }
                }
            )
        }
    }
}
