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
import {PassingTestModule} from "./pages/passing-test/passing-test.module";
import {TestResultModule} from "./pages/test-result/test-result.module";
import {LoginModule} from "./pages/login/login.module";
import {SignupModule} from "./pages/signup/signup.module";
import {ForgotPasswordModule} from "./pages/forgot-password/forgot-password.module";
import {ResetPasswordModule} from "./pages/reset-password/reset-password.module";
import {EmailConfirmModule} from "./pages/email-confirm/email-confirm.module";
import {ProfileModule} from "./pages/profile/profile.module";
import {RegisterUserModule} from "./pages/register-user/register-user.module";
import {TestTemplateCreateModule} from "./pages/test-template-create/test-template-create.module";
import {TestTemplateEditModule} from "./pages/test-template-edit/test-template-edit.module";
import {QuestionsPoolTmplEditModule} from "./pages/questions-pool-tmpl-edit/questions-pool-tmpl-edit.module";
import {QuestionEditModule} from "./pages/question-edit/question-edit.module";
import {QuestionTmplEditModule} from "./pages/question-tmpl-edit/question-tmpl-edit.module";
import {TestCreateModule} from "./pages/test-create/test-create.module";
import {TestEditModule} from "./pages/test-edit/test-edit.module";
import {UserEditModule} from "./pages/user-edit/user-edit.module";
import {QuestionsPoolEditModule} from "./pages/questions-pool-edit/questions-pool-edit.module";
import {TestsListModule} from "./pages/tests-list/tests-list.module";
import {UsersListModule} from "./pages/users-list/users-list.module";
import {TestTemplatesListModule} from "./pages/test-templates-list/test-templates-list.module";
import {TestStatisticModule} from "./pages/test-statistic/test-statistic.module";


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
        PassingTestModule,
        TestResultModule,
        LoginModule,
        SignupModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        EmailConfirmModule,
        ProfileModule,
        RegisterUserModule,
        TestTemplateCreateModule,
        TestTemplateEditModule,
        QuestionsPoolTmplEditModule,
        QuestionEditModule,
        QuestionTmplEditModule,
        TestCreateModule,
        TestEditModule,
        UserEditModule,
        QuestionsPoolEditModule,
        TestsListModule,
        UsersListModule,
        TestTemplatesListModule,
        TestStatisticModule
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
