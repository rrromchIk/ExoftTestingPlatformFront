import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestResultComponent} from "./test-result/test-result.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {RouterModule} from "@angular/router";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";


@NgModule({
    declarations: [
        TestResultComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        AppMaterialModule,
        AppComponentsModule
    ]
})
export class TestResultModule {
}
