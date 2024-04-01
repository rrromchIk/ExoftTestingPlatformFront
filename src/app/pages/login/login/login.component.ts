import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/api/auth.api.service";
import {Router} from "@angular/router";
import {UserLoginDto} from "../../../core/interfaces/user-login.dto";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    errorMessage: string | null = null;
    hidePassword: boolean = true;
    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
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

            this.authService.logIn(userLoginDto).subscribe(
                res => {
                    console.log(res);
                    this.router.navigate(['/']);
                },
                error => {
                    this.errorMessage = error;
                }
            )
        }
    }
}
