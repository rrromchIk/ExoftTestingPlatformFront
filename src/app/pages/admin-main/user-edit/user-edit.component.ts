import {Component, OnInit} from '@angular/core';
import {UserModel} from "../../../core/interfaces/user/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {UpdatedUserDto} from "../../../core/interfaces/user/updated-user.dto";
import {FIRST_AND_LAST_NAMES_PATTERN} from "../../../core/constants/validation.constants";
import {ActivatedRoute} from "@angular/router";
import {EditUserService} from "../../../shared/services/edit-user.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
    user: UserModel;
    editUserForm: FormGroup;
    avatarLinkToDisplay: string | null = null;
    uploadedUserAvatar: File | null = null;
    userDataChanges: boolean = false;
    userAvatarChanges: boolean = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private editUserPageService: EditUserService
    ) {}

    ngOnInit() {
        this.editUserForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            lastName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            email: [''],
            emailConfirmed: [],
            role: ['']
        });

        const userId = this.route.snapshot.params['id']
        this.avatarLinkToDisplay = `${environment.apiUrl}/api/users/${userId}/avatar/download`

        this.editUserPageService.getUserById(userId);

        this.editUserPageService.user$
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    if(data) {
                        this.user = data;

                        this.setUserDataToFormFields();

                        const initialFormValues = { ...this.editUserForm.value };
                        this.editUserForm.valueChanges
                            .pipe(untilDestroyed(this))
                            .subscribe(() => {
                                this.userDataChanges = this.isFormChanged(initialFormValues);
                            });
                    }
                }
            }
        )
    }

    getFormControl(name: string) {
        return this.editUserForm.get(name);
    }

    onSubmit() {
        if (this.editUserForm.valid && this.userDataChanges) {
            const userToUpdate: UpdatedUserDto = {
                firstName: this.editUserForm.value.firstName,
                lastName: this.editUserForm.value.lastName
            }

            this.editUserPageService.updateUser(this.user.id, userToUpdate);
        }

        if(this.uploadedUserAvatar && this.userAvatarChanges) {
            this.editUserPageService.updateUserAvatar(this.user.id, this.uploadedUserAvatar);
        }
    }

    setUserDataToFormFields() {
        this.editUserForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            emailConfirmed: this.user.emailConfirmed,
            role: this.user.role
        })
        this.uploadedUserAvatar = null;
        this.avatarLinkToDisplay = `${environment.apiUrl}/api/users/${this.user.id}/avatar/download`;
        this.userDataChanges = false;
        this.userAvatarChanges = false;
    }

    isFormChanged(initialFormValues: any) {
        return JSON.stringify(initialFormValues) !== JSON.stringify(this.editUserForm.value);
    }

    onImageUploadedEvent(file: File) {
        console.log("handling event")
        this.userAvatarChanges = true;
        this.uploadedUserAvatar = file;

        this.avatarLinkToDisplay = URL.createObjectURL(this.uploadedUserAvatar);
    }
}
