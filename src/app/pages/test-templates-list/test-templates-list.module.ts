import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestTemplatesListComponent} from "./test-templates-list.component";
import {TestTemplateItemComponent} from "./test-template-item/test-template-item.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {RouterLink} from "@angular/router";


@NgModule({
    declarations: [
        TestTemplatesListComponent,
        TestTemplateItemComponent,
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        AppComponentsModule,
        RouterLink
    ]
})
export class TestTemplatesListModule {
}
