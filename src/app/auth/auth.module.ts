import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../shared/modules/app-material/app-material.module";
import {RouterLink} from "@angular/router";
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {AppComponentsModule} from "../shared/modules/app-components/app-components.module";
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppMaterialModule,
        RouterLink,
        AppComponentsModule
    ],
    providers: [

    ]
})
export class AuthModule {
}
