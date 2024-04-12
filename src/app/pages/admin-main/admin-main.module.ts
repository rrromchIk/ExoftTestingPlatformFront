import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminMainRoutingModule} from './admin-main-routing.module';
import {AdminMainComponent} from './admin-main.component';
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";

@NgModule({
    declarations: [
        AdminMainComponent,
    ],
    imports: [
        CommonModule,
        AdminMainRoutingModule,
        AppMaterialModule,
    ]
})
export class AdminMainModule {
}
