import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorComponent} from "../../components/paginator/paginator.component";
import {HeaderComponent} from "../../components/header/header.component";
import {AppMaterialModule} from "../app-material/app-material.module";


@NgModule({
    declarations: [
        PaginatorComponent,
        HeaderComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule
    ],
    exports: [
        PaginatorComponent,
        HeaderComponent
    ]
})
export class AppComponentsModule {
}
