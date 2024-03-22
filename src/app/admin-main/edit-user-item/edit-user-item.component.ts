import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {UserResponseDto} from "../../shared/models/user-response.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-edit-user-item',
    templateUrl: './edit-user-item.component.html',
    styleUrl: './edit-user-item.component.scss'
})
export class EditUserItemComponent implements OnInit {
    user: UserResponseDto | null = null;
    // @ts-ignore
    form: FormGroup;
    private formSubmitAttempt: boolean = false;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        //private authService: AuthService
    ) {
    }

    @Input()
    set id(userId: string) {
        this.userService.getUserById(userId).subscribe(response => {
              this.user = response;
        });
    }

    ngOnInit() {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required]
        });

        console.log(this.form);
    }

    isFieldInvalid(field: string) {
        return (true
            //(!this.form.get(field).valid && this.form.get(field).touched) ||
            //(this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        console.log(this.form)
        // @ts-ignore
        if (this.form.valid) {
            //this.authService.login(this.form.value);
        }
        this.formSubmitAttempt = true;
    }

}
