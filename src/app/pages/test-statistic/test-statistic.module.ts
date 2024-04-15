import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestStatisticComponent} from "./test-statistic.component";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";


@NgModule({
    declarations: [TestStatisticComponent],
    imports: [
        CommonModule,
        AppComponentsModule,
        AppMaterialModule,
    ]
})
export class TestStatisticModule {
}
