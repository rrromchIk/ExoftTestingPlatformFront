import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestTemplateCreateComponent} from './test-template-create.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";

import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";


@NgModule({
    declarations: [
        TestTemplateCreateComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        AppMaterialModule,
        ReactiveFormsModule
    ]
})
export class TestTemplateCreateModule {
}
