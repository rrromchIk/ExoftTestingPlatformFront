import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/api/auth.api.service";
import {Router} from "@angular/router";
import {passwordsMatchValidator} from "../../../core/helpers/form-validators";
import {UserSignupDto} from "../../../core/interfaces/user-signup.dto";


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
    errorMessage: string | null = null;
    hidePassword: boolean = true;
    signUpForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.signUpForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,
                            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'),
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
            this.authService.signUp(userSignUpDto).subscribe(
                res => {
                    console.log(res);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.errorMessage = error;
                }
            )
        }
    }
}
