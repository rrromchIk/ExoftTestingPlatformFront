import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../shared/modules/app-material/app-material.module";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {RouterLink} from "@angular/router";
import { SignupComponent } from './signup/signup.component';


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppMaterialModule,
        RouterLink
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
                subscriptSizing: 'dynamic'
            }
        }
    ]
})
export class AuthModule {
}
