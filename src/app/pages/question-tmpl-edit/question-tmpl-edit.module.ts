import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionTmplEditComponent} from './question-tmpl-edit.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";

@NgModule({
    declarations: [
        QuestionTmplEditComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        AppMaterialModule,
        ReactiveFormsModule
    ]
})
export class QuestionTmplEditModule {
}
