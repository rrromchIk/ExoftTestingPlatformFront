import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminMainComponent} from './admin-main.component';
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {RouterLink, RouterOutlet} from "@angular/router";

@NgModule({
    declarations: [
        AdminMainComponent,
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        RouterLink,
        RouterOutlet,
    ]
})
export class AdminMainModule {
}
