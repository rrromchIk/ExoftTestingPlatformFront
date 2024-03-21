import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    // @ts-ignore
    form: FormGroup;
    private formSubmitAttempt: boolean = false;

    constructor(
        private fb: FormBuilder,
        //private authService: AuthService
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    isFieldInvalid(field: string) {
        return (true
            //(!this.form.get(field).valid && this.form.get(field).touched) ||
            //(this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            //this.authService.login(this.form.value);
        }
        this.formSubmitAttempt = true;
    }
}
