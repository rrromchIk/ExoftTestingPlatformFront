import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FIRST_AND_LAST_NAMES_PATTERN, PASSWORD_PATTERN} from "../../core/constants/validation.constants";
import {passwordsMatchValidator} from "../../core/helpers/form-validators";
import {UserSignupDto} from "../../core/interfaces/user/user-signup.dto";
import {AlertService} from "../../shared/services/alert.service";
import {AuthApiService} from "../../core/services/api/auth.api.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {UserModel} from "../../core/interfaces/user/user.model";
import {Observable} from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
    hidePassword: boolean = true;
    registerUserForm: FormGroup;
    currentUser: UserModel;

    constructor(private fb: FormBuilder,
                private alertService: AlertService,
                private authApiService: AuthApiService,
                private authService: AuthService,
                private router: Router) {}

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser()!;

        this.registerUserForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            lastName: ['', [Validators.required, Validators.pattern(FIRST_AND_LAST_NAMES_PATTERN)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,
                Validators.pattern(PASSWORD_PATTERN),
                passwordsMatchValidator('confirmPassword', true)]],
            confirmPassword: ['', [Validators.required, passwordsMatchValidator('password')]],
            userRole: ['', Validators.required]
        });
    }

    getFormControl(name: string) {
        return this.registerUserForm.get(name);
    }

    onSubmit() {
        if (this.registerUserForm.valid) {
            const userSignUpDto: UserSignupDto = {
                firstName: this.registerUserForm.value.firstName,
                lastName: this.registerUserForm.value.lastName,
                email: this.registerUserForm.value.email,
                password: this.registerUserForm.value.password,
            }

            let obs: Observable<UserModel>;
            if(this.registerUserForm.value.userRole === 'user') {
                obs = this.authApiService.register(userSignUpDto);
            } else {
                obs = this.authApiService.registerAdmin(userSignUpDto);
            }

            obs
                .pipe(untilDestroyed(this))
                .subscribe({
                    next: (data) => {
                        this.alertService.success('User registered successfully');
                        this.router.navigate(['/admin', 'users', data.id, 'edit']);
                    },
                    error: () => {
                        this.alertService.error('Unable to register user');
                    }
                });
        }
    }
}
