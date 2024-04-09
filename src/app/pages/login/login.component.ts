import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserLoginDto} from "../../core/interfaces/user/user-login.dto";
import {UntilDestroy} from "@ngneat/until-destroy";
import {AuthService} from "../../shared/services/auth.service";

@UntilDestroy()
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    hidePassword: boolean = true;
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    getFormControl(name: string) {
        return this.loginForm.get(name);
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const userLoginDto: UserLoginDto = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password
            }

            this.authService.logIn(userLoginDto);
        }
    }
}
