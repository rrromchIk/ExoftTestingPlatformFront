import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";


@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule,
        AppComponentsModule,
        RouterModule
    ]
})
export class ForgotPasswordModule {
}
