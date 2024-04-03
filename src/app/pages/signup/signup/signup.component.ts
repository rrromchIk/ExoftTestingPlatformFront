import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordsMatchValidator} from "../../../core/helpers/form-validators";
import {UserSignupDto} from "../../../core/interfaces/user/user-signup.dto";
import {FIRST_AND_LAST_NAMES_PATTERN, PASSWORD_PATTERN} from "../../../core/constants/validation.constants";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
    hidePassword: boolean = true;
    signUpForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.signUpForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            lastName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,
                            Validators.pattern(PASSWORD_PATTERN),
                            passwordsMatchValidator('confirmPassword', true)]],
            confirmPassword: ['', [Validators.required, passwordsMatchValidator('password')]]
        });
    }

    getFormControl(name: string) {
        return this.signUpForm.get(name);
    }

    onSubmit() {
        if (this.signUpForm.valid) {
            const userSignUpDto: UserSignupDto = {
                firstName: this.signUpForm.value.firstName,
                lastName: this.signUpForm.value.lastName,
                email: this.signUpForm.value.email,
                password: this.signUpForm.value.password,
            }
            this.authService.signUp(userSignUpDto)
        }
    }
}
