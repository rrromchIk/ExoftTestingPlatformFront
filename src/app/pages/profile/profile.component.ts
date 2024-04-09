import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {UserModel} from "../../core/interfaces/user/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FIRST_AND_LAST_NAMES_PATTERN} from "../../core/constants/validation.constants";
import {environment} from "../../../environments/environment";
import {UpdatedUserDto} from "../../core/interfaces/user/updated-user.dto";
import {AlertService} from "../../shared/services/alert.service";
import {AuthApiService} from "../../core/services/api/auth.api.service";
import {EditUserService} from "../../shared/services/edit-user.service";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordDialogComponent} from "./change-password-dialog/change-password-dialog.component";

@UntilDestroy()
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    user: UserModel | null = null;
    profileUserForm: FormGroup;
    avatarLinkToDisplay: string | null = null;
    uploadedUserAvatar: File | null = null;
    userDataChanges: boolean = false;
    userAvatarChanges: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private alertService: AlertService,
        private authApiService: AuthApiService,
        private userEditService: EditUserService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.profileUserForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            lastName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            email: [''],
            emailConfirmed: [],
            role: ['']
        });

        this.userEditService.getUserById(this.authService.getCurrentUser().id);

        this.userEditService.user$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if (data) {
                        this.user = data;

                        this.authService.setCurrentUser(this.user);
                        this.setUserDataToFormFields();

                        const initialFormValues = {...this.profileUserForm.value};
                        this.profileUserForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.userDataChanges = this.isFormChanged(initialFormValues);
                            });
                    }
                }
            })
    }

    getFormControl(name: string) {
        return this.profileUserForm.get(name);
    }

    onFormSubmit() {
        if (this.profileUserForm.valid && this.userDataChanges) {
            const userToUpdateDto: UpdatedUserDto = {
                firstName: this.profileUserForm.value.firstName,
                lastName: this.profileUserForm.value.lastName
            }

            this.userEditService.updateUser(this.user!.id, userToUpdateDto);
        }

        if (this.uploadedUserAvatar && this.userAvatarChanges) {
            this.userEditService.updateUserAvatar(this.user!.id, this.uploadedUserAvatar);
        }
    }

    onVerifyEmailButtonClicked() {
        this.authApiService.confirmEmailRequest()
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success('We have send verification link to your email');
                },
                error: () => {
                    this.alertService.error('Error while sending email. Try again later.')
                }
            })
    }

    openChangePasswordDialog() {
        this.dialog.open(ChangePasswordDialogComponent);
    }

    onImageUploadedEvent(file: File) {
        this.userAvatarChanges = true;
        this.uploadedUserAvatar = file;

        this.avatarLinkToDisplay = URL.createObjectURL(this.uploadedUserAvatar);
    }

    setUserDataToFormFields() {
        this.profileUserForm.patchValue({
            firstName: this.user?.firstName,
            lastName: this.user?.lastName,
            email: this.user?.email,
            emailConfirmed: this.user?.emailConfirmed,
            role: this.user?.role
        })

        //forcing browser to download new image
        this.avatarLinkToDisplay = `${environment.apiUrl}/api/users/${this.user?.id}/avatar/download?randomise=${Math.random()}`;
        this.uploadedUserAvatar = null;
        this.userDataChanges = false;
        this.userAvatarChanges = false;
    }

    private isFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.profileUserForm.value);
    }
}
