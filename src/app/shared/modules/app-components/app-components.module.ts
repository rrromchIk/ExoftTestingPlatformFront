import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorComponent} from "../../components/paginator/paginator.component";
import {HeaderComponent} from "../../components/header/header.component";
import {AppMaterialModule} from "../app-material/app-material.module";
import {BackButtonDirective} from "../../directives/back-button.directive";
import {UserAvatarUploaderComponent} from "../../components/user-avatar-uploader/user-avatar-uploader.component";
import {DateTimeFormatPipe} from "../../pipes/date-time-format.pipe";
import {FiltersComponent} from "../../components/filters/filters.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        PaginatorComponent,
        HeaderComponent,
        BackButtonDirective,
        UserAvatarUploaderComponent,
        DateTimeFormatPipe,
        FiltersComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule
    ],
    exports: [
        PaginatorComponent,
        HeaderComponent,
        BackButtonDirective,
        UserAvatarUploaderComponent,
        DateTimeFormatPipe,
        FiltersComponent
    ]
})
export class AppComponentsModule {
}
