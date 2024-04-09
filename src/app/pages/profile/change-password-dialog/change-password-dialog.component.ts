import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../../shared/components/dialog/confirmation-dialog.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PASSWORD_PATTERN} from "../../../core/constants/validation.constants";
import {passwordsMatchValidator} from "../../../core/helpers/form-validators";
import {ChangePasswordDto} from "../../../core/interfaces/auth/change-password.dto";
import {AuthApiService} from "../../../core/services/api/auth.api.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AlertService} from "../../../shared/services/alert.service";

@UntilDestroy()
@Component({
    selector: 'app-change-password-dialog',
    templateUrl: './change-password-dialog.component.html',
    styleUrl: './change-password-dialog.component.scss'
})
export class ChangePasswordDialogComponent implements OnInit {
    changePasswordForm: FormGroup;
    hidePassword: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        private fb: FormBuilder,
        private authApiService: AuthApiService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.changePasswordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN),
                passwordsMatchValidator('confirmNewPassword', true)]],
            confirmNewPassword: ['', [Validators.required, passwordsMatchValidator('newPassword')]]
        });
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

    getFormControl(name: string) {
        return this.changePasswordForm.get(name);
    }

    onFormSubmit() {
        if (this.changePasswordForm.valid) {
            const resetPasswordDto: ChangePasswordDto = {
                currentPassword: this.changePasswordForm.value.currentPassword,
                newPassword: this.changePasswordForm.value.newPassword
            }

            this.authApiService.changePassword(resetPasswordDto)
                .pipe(untilDestroyed(this))
                .subscribe({
                    next: () => {
                        this.alertService.success('Password change successfully');
                        this.changePasswordForm.reset();
                    },
                    error: (err) => {
                        this.alertService.success(err.error.detail || 'Unable to change password')
                    }
                });
        } else {
            this.changePasswordForm.markAsDirty();
            this.changePasswordForm.updateValueAndValidity();
        }
    }
}
