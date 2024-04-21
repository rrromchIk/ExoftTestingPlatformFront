import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionsPoolEditComponent} from "./questions-pool-edit.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {RouterLink} from "@angular/router";


@NgModule({
    declarations: [
        QuestionsPoolEditComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule,
        AppComponentsModule,
        RouterLink
    ]
})
export class QuestionsPoolEditModule {
}
