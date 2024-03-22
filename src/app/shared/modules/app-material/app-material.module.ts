import {NgModule} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDividerModule} from "@angular/material/divider";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule, MatNavList} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
    declarations: [],
    imports: [
        MatNavList,
    ],
    exports: [
        //CommonModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatIconModule,
        MatTabsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatDividerModule,
        MatSidenavModule,
        MatMenuModule,
        MatNavList,
        MatListModule,
        MatExpansionModule,
        MatTooltipModule,
        MatInputModule
    ],
    providers: [
        provideAnimationsAsync()
    ]
})
export class AppMaterialModule {
}
