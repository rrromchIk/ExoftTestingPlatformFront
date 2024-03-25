import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminMainRoutingModule} from './admin-main-routing.module';
import {AdminMainComponent} from './admin-main.component';
import {TestsListComponent} from "./tests-list/tests-list.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {TestItemComponent} from "./tests-list/test-item/test-item.component";
import {UserItemComponent} from "./users-list/user-item/user-item.component";
import {AppMaterialModule} from "../shared/modules/app-material/app-material.module";
import {EditUserItemComponent} from "./edit-user-item/edit-user-item.component";
import {AppComponentsModule} from "../shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        AdminMainComponent,
        TestsListComponent,
        UsersListComponent,
        TestItemComponent,
        UserItemComponent,
        EditUserItemComponent,
    ],
    imports: [
        CommonModule,
        AdminMainRoutingModule,
        AppMaterialModule,
        AppComponentsModule,
        ReactiveFormsModule,
    ]
})
export class AdminMainModule {
}
