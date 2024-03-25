import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {UserModel} from "../../shared/models/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UpdatedUserDto} from "../../shared/models/updated-user.dto";

@Component({
    selector: 'app-edit-user-item',
    templateUrl: './edit-user-item.component.html',
    styleUrl: './edit-user-item.component.scss'
})
export class EditUserItemComponent implements OnInit {
    user!: UserModel;
    editUserForm!: FormGroup;
    selectedImage: File | null = null;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
    ) {
    }

    @Input()
    set id(userId: string) {
        this.userService.getUserById(userId).subscribe(response => {
            this.user = response;
            this.editUserForm.patchValue({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.email,
                emailConfirmed: this.user.emailConfirmed,
                role: this.user.userRole
            })
        });
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
        if (this.editUserForm.valid) {
            const userToUpdate: UpdatedUserDto = {
                firstName: this.editUserForm.value.firstName,
                lastName: this.editUserForm.value.lastName
            }

            if (this.user) {
                this.userService.update(this.user.id, userToUpdate).subscribe(
                    res => {
                        console.log(res);
                        this.user.firstName = userToUpdate.firstName;
                        this.user.lastName = userToUpdate.lastName;
                    }
                )
            }
        }
    }


    onFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length) {
            this.selectedImage = inputElement.files[0];
        }
    }

    getImageUrl() {
        if (this.selectedImage) {
            return URL.createObjectURL(this.selectedImage);
        }
        return './assets/images/default-avatar.png';
    }
}
