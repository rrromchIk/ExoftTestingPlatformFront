import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {UserEditComponent} from "./user-edit.component";


@NgModule({
    declarations: [
        UserEditComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        ReactiveFormsModule,
        AppMaterialModule
    ]
})
export class UserEditModule {

}
