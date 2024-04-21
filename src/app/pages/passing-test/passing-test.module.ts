import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PassingTestComponent} from "./passing-test.component";
import {TimerItemComponent} from "./timer-item/timer-item.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";


@NgModule({
    declarations: [
        PassingTestComponent,
        TimerItemComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule
    ]
})
export class PassingTestModule {
}
