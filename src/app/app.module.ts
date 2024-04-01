import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthInterceptorService} from "./core/interceptors/auth.interceptor.service";
import {AppComponentsModule} from "./shared/modules/app-components/app-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AdminMainModule} from "./pages/admin-main/admin-main.module";
import {UserMainModule} from "./pages/user-main/user-main.module";
import {AuthModule} from "./auth/auth.module";
import {PassingTestModule} from "./pages/passing-test/passing-test.module";
import {TestResultModule} from "./pages/test-result/test-result.module";


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        AppComponentsModule,
        ReactiveFormsModule,
        AdminMainModule,
        UserMainModule,
        AuthModule,
        PassingTestModule,
        TestResultModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
