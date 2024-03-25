import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorComponent} from "../../components/paginator/paginator.component";
import {HeaderComponent} from "../../components/header/header.component";
import {AppMaterialModule} from "../app-material/app-material.module";
import {BackButtonDirective} from "../../directives/back-button.directive";
import {UserAvatarUploaderComponent} from "../../components/user-avatar-uploader/user-avatar-uploader.component";


@NgModule({
    declarations: [
        PaginatorComponent,
        HeaderComponent,
        BackButtonDirective,
        UserAvatarUploaderComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule
    ],
    exports: [
        PaginatorComponent,
        HeaderComponent,
        BackButtonDirective,
        UserAvatarUploaderComponent
    ]
})
export class AppComponentsModule {
}
