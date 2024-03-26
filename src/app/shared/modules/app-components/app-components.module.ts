import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorComponent} from "../../components/paginator/paginator.component";
import {HeaderComponent} from "../../components/header/header.component";
import {AppMaterialModule} from "../app-material/app-material.module";
import {BackButtonDirective} from "../../directives/back-button.directive";
import {UserAvatarUploaderComponent} from "../../components/user-avatar-uploader/user-avatar-uploader.component";
import {DateTimeFormatPipe} from "../../pipes/date-time-format.pipe";


@NgModule({
    declarations: [
        PaginatorComponent,
        HeaderComponent,
        BackButtonDirective,
        UserAvatarUploaderComponent,
        DateTimeFormatPipe
    ],
    imports: [
        CommonModule,
        AppMaterialModule
    ],
    exports: [
        PaginatorComponent,
        HeaderComponent,
        BackButtonDirective,
        UserAvatarUploaderComponent,
        DateTimeFormatPipe
    ]
})
export class AppComponentsModule {
}
