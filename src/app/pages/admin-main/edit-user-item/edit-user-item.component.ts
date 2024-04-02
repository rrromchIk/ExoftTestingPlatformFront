import {Component, Input, OnInit} from '@angular/core';
import {UserModel} from "../../../core/interfaces/user/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserApiService} from "../../../core/services/api/user.api.service";
import {environment} from "../../../../environments/environment";
import {UpdatedUserDto} from "../../../core/interfaces/user/updated-user.dto";
import {FIRST_AND_LAST_NAMES_PATTERN} from "../../../core/constants/validation.constants";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-edit-user-item',
    templateUrl: './edit-user-item.component.html',
    styleUrl: './edit-user-item.component.scss'
})
export class EditUserItemComponent implements OnInit {
    user!: UserModel;
    editUserForm!: FormGroup;
    avatarLinkToDisplay: string | null = null;
    uploadedUserAvatar: File | null = null;
    userDataChanges: boolean = false;
    userAvatarChanges: boolean = false;
    initialFormValues: any;

    constructor(
        private userService: UserApiService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
    }
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

        this.userService.getUserById(userId).subscribe(response => {
            this.user = response;
            console.log(this.user);
            this.setUserDataToFormFields();

            this.initialFormValues = { ...this.editUserForm.value };

            this.editUserForm.valueChanges.subscribe(() => {
                this.userDataChanges = this.isFormChanged();
            });
        });
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

            this.userService.update(this.user.id, userToUpdate).subscribe(
                res => {
                    console.log(res);
                    this.user.firstName = userToUpdate.firstName;
                    this.user.lastName = userToUpdate.lastName;
                    this.userDataChanges = false;
                }
            )
        }

        if(this.uploadedUserAvatar && this.userAvatarChanges)
            this.userService.updateAvatar(this.user.id, this.uploadedUserAvatar).subscribe(
                res => {
                    console.log(res);
                    this.userAvatarChanges = false;
                }
            )
    }

    setUserDataToFormFields() {
        this.editUserForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            emailConfirmed: this.user.emailConfirmed,
            role: this.user.userRole
        })
        this.uploadedUserAvatar = null;
        this.avatarLinkToDisplay = `${environment.apiUrl}/api/users/${this.user.id}/avatar/download`
    }

    isFormChanged() {
        return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.editUserForm.value);
    }

    onImageUploadedEvent(file: File) {
        console.log("handling event")
        this.userAvatarChanges = true;
        this.uploadedUserAvatar = file;

        this.avatarLinkToDisplay = URL.createObjectURL(this.uploadedUserAvatar);
    }
}
