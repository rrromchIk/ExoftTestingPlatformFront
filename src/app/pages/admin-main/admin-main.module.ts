import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminMainRoutingModule} from './admin-main-routing.module';
import {AdminMainComponent} from './admin-main.component';
import {TestsListComponent} from "./tests-list/tests-list.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {TestItemComponent} from "./tests-list/test-item/test-item.component";
import {UserItemComponent} from "./users-list/user-item/user-item.component";
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TestTemplatesListComponent } from './test-templates-list/test-templates-list.component';
import { TestTemplateItemComponent } from './test-templates-list/test-template-item/test-template-item.component';
import { TestCreateComponent } from './test-create/test-create.component';
import { TestEditComponent } from './test-edit/test-edit.component';
import { QuestionsPoolEditComponent } from './questions-pool-edit/questions-pool-edit.component';

@NgModule({
    declarations: [
        AdminMainComponent,
        TestsListComponent,
        UsersListComponent,
        TestItemComponent,
        UserItemComponent,
        UserEditComponent,
        TestTemplatesListComponent,
        TestTemplateItemComponent,
        TestCreateComponent,
        TestEditComponent,
        QuestionsPoolEditComponent,
    ],
    imports: [
        CommonModule,
        AdminMainRoutingModule,
        AppMaterialModule,
        AppComponentsModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class AdminMainModule {
}
