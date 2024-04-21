import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {TestCreateComponent} from "./test-create.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";


@NgModule({
    declarations: [
        TestCreateComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        AppComponentsModule
    ]
})
export class TestCreateModule {
}
