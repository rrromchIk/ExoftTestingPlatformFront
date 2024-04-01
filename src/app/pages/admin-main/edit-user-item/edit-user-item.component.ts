import {Component, Input, OnInit} from '@angular/core';
import {UserModel} from "../../../core/interfaces/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../core/services/api/user.api.service";
import {environment} from "../../../../environments/environment";
import {UpdatedUserDto} from "../../../core/interfaces/updated-user.dto";

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
        private userService: UserService,
        private fb: FormBuilder,
    ) {
    }

    @Input()
    set id(userId: string) {
        this.userService.getUserById(userId).subscribe(response => {
            this.user = response;
            console.log(this.user);
            this.setUserDataToFormFields();

            this.initialFormValues = { ...this.editUserForm.value };

            this.editUserForm.valueChanges.subscribe(() => {
                this.userDataChanges = this.isFormChanged();
            });
        });


        this.avatarLinkToDisplay = `${environment.apiUrl}/api/users/${userId}/avatar/download`
    }

    ngOnInit() {
        this.editUserForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
            email: [''],
            emailConfirmed: [],
            role: ['']
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
        this.userAvatarChanges = true;
        this.uploadedUserAvatar = file;

        this.avatarLinkToDisplay = URL.createObjectURL(this.uploadedUserAvatar);
    }
}
