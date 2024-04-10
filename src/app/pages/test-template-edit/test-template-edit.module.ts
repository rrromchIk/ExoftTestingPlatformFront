import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestTemplateEditComponent} from './test-template-edit.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {RouterLink} from "@angular/router";

@NgModule({
    declarations: [
        TestTemplateEditComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        AppMaterialModule,
        ReactiveFormsModule,
        RouterLink
    ]
})
export class TestTemplateEditModule {
}
