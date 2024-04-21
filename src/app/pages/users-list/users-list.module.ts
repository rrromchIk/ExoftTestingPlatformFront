import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersListComponent} from "./users-list.component";
import {UserItemComponent} from "./user-item/user-item.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {RouterLink} from "@angular/router";


@NgModule({
    declarations: [
        UsersListComponent,
        UserItemComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        AppComponentsModule,
        RouterLink
    ]
})
export class UsersListModule {
}
