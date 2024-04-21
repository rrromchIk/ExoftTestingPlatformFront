import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestEditComponent} from "./test-edit.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";


@NgModule({
    declarations: [
        TestEditComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule,
        RouterLink,
        AppComponentsModule
    ]
})
export class TestEditModule {
}
