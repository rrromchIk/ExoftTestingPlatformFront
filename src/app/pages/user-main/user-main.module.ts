import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMainComponent} from './user-main.component';
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import { TestsToPassListComponent } from './tests-to-pass-list/tests-to-pass-list.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import { TestToPassItemComponent } from './tests-to-pass-list/test-to-pass-item/test-to-pass-item.component';
import { StartedTestsListComponent } from './started-tests-list/started-tests-list.component';
import { StartedTestItemComponent } from './started-tests-list/started-test-item/started-test-item.component';
import {UserMainRoutingModule} from "./user-main-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TestCompletionPipe} from "./pipes/test-completion-status.pipe";

@NgModule({
    declarations: [
        UserMainComponent,
        TestsToPassListComponent,
        TestToPassItemComponent,
        StartedTestsListComponent,
        StartedTestItemComponent,
        TestCompletionPipe,
    ],
    imports: [
        CommonModule,
        UserMainRoutingModule,
        AppMaterialModule,
        AppComponentsModule,
        ReactiveFormsModule,
    ]
})
export class UserMainModule {}
