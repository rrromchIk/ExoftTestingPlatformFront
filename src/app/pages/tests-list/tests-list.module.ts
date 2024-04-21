import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestsListComponent} from "./tests-list.component";
import {TestItemComponent} from "./test-item/test-item.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {RouterLink} from "@angular/router";


@NgModule({
    declarations: [
        TestsListComponent,
        TestItemComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        AppComponentsModule,
        RouterLink
    ]
})
export class TestsListModule {
}
