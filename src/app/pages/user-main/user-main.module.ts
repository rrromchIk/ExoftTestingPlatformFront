import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMainComponent} from './user-main.component';
import {AppMaterialModule} from "../../shared/modules/app-material/app-material.module";
import { TestsToPassListComponent } from './components/tests-to-pass-list/tests-to-pass-list.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import { TestToPassItemComponent } from './components/tests-to-pass-list/test-to-pass-item/test-to-pass-item.component';
import { StartedTestsListComponent } from './components/started-tests-list/started-tests-list.component';
import { StartedTestItemComponent } from './components/started-tests-list/started-test-item/started-test-item.component';
import {ReactiveFormsModule} from "@angular/forms";
import {TestCompletionPipe} from "./pipes/test-completion-status.pipe";
import { UserStatisticComponent } from './components/user-statistic/user-statistic.component';
import {RouterLink, RouterOutlet} from "@angular/router";

@NgModule({
    declarations: [
        UserMainComponent,
        TestsToPassListComponent,
        TestToPassItemComponent,
        StartedTestsListComponent,
        StartedTestItemComponent,
        TestCompletionPipe,
        UserStatisticComponent,
    ],
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        AppMaterialModule,
        AppComponentsModule,
        ReactiveFormsModule,
    ]
})
export class UserMainModule {}
