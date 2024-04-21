import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupComponent} from "./signup.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [
        SignupComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class SignupModule {
}
