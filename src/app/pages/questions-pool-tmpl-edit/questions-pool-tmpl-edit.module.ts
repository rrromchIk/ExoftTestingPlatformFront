import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionsPoolTmplEditComponent} from './questions-pool-tmpl-edit.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";


@NgModule({
    declarations: [
        QuestionsPoolTmplEditComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        AppMaterialModule,
        ReactiveFormsModule
    ]
})
export class QuestionsPoolTmplEditModule {
}
