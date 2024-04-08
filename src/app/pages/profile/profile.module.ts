import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile/profile.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";


@NgModule({
    declarations: [
        ProfileComponent,
        ChangePasswordDialogComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        AppMaterialModule,
        ReactiveFormsModule
    ]
})
export class ProfileModule {
}
