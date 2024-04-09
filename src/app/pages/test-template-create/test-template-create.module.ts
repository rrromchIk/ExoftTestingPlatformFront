import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestTemplateCreateComponent} from './test-template-create.component';
import {AppComponentsModule} from "../../shared/modules/app-components/app-components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";


@NgModule({
    declarations: [
        TestTemplateCreateComponent
    ],
    imports: [
        CommonModule,
        AppComponentsModule,
        FormsModule,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatError,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatSuffix,
        ReactiveFormsModule
    ]
})
export class TestTemplateCreateModule {
}
