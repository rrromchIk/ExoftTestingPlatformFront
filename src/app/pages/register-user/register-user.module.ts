import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterUserComponent} from './register-user.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";


@NgModule({
    declarations: [
        RegisterUserComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule,
        RouterLink,
        AppComponentsModule
    ]
})
export class RegisterUserModule {
}
