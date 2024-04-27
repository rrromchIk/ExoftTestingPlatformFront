import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserMainComponent} from "./pages/user-main/user-main.component";
import {TestsToPassListComponent} from "./pages/user-main/components/tests-to-pass-list/tests-to-pass-list.component";
import {StartedTestsListComponent} from "./pages/user-main/components/started-tests-list/started-tests-list.component";
import {PassingTestComponent} from "./pages/passing-test/passing-test.component";
import {TestResultComponent} from "./pages/test-result/test-result.component";
import {LoginComponent} from "./pages/login/login.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {ForgotPasswordComponent} from "./pages/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./pages/reset-password/reset-password.component";
import {AdminMainComponent} from "./pages/admin-main/admin-main.component";
import {TestsListComponent} from "./pages/tests-list/tests-list.component";
import {UsersListComponent} from "./pages/users-list/users-list.component";
import {UserEditComponent} from "./pages/user-edit/user-edit.component";
import {TestTemplatesListComponent} from "./pages/test-templates-list/test-templates-list.component";
import {TestCreateComponent} from "./pages/test-create/test-create.component";
import {AdminGuard, AuthenticatedGuard, CanDeactivateGuard, PassingTestGuard} from "./core/guards/guards";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {ForbiddenComponent} from "./pages/forbidden/forbidden.component";
import {TestEditComponent} from "./pages/test-edit/test-edit.component";
import {QuestionsPoolEditComponent} from "./pages/questions-pool-edit/questions-pool-edit.component";
import {EmailConfirmComponent} from "./pages/email-confirm/email-confirm.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {RegisterUserComponent} from "./pages/register-user/register-user.component";
import {TestTemplateCreateComponent} from "./pages/test-template-create/test-template-create.component";
import {TestTemplateEditComponent} from "./pages/test-template-edit/test-template-edit.component";
import {QuestionsPoolTmplEditComponent} from "./pages/questions-pool-tmpl-edit/questions-pool-tmpl-edit.component";
import {QuestionEditComponent} from "./pages/question-edit/question-edit.component";
import {QuestionTmplEditComponent} from "./pages/question-tmpl-edit/question-tmpl-edit.component";
import {UserStatisticComponent} from "./pages/user-main/components/user-statistic/user-statistic.component";
import {TestStatisticComponent} from "./pages/test-statistic/test-statistic.component";


const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'user-main',
        component: UserMainComponent,
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                redirectTo: 'all-tests',
                pathMatch: 'full'
            },
            {
                path: 'all-tests',
                component: TestsToPassListComponent
            },
            {
                path: 'started-tests',
                component: StartedTestsListComponent
            },
            {
                path: 'user-statistic',
                component: UserStatisticComponent
            },
        ]
    },
    {
        path: 'pass-test',
        component: PassingTestComponent,
        canActivate: [AuthenticatedGuard, PassingTestGuard]
    },
    {
        path: 'test-result',
        component: TestResultComponent,
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        canDeactivate: [CanDeactivateGuard],
        component: SignupComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'email-confirm',
        component: EmailConfirmComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'admin',
        component: AdminMainComponent,
        canActivate: [AuthenticatedGuard, AdminGuard],
        children: [
            {
                path: '',
                redirectTo: 'tests',
                pathMatch: "full"
            },
            {
                path: 'tests',
                component: TestsListComponent
            },
            {
                path: 'users',
                component: UsersListComponent
            },
            {
                path: 'users/:id/edit',
                component: UserEditComponent
            },
            {
                path: 'test-templates',
                component: TestTemplatesListComponent
            },
            {
                path: 'test-create',
                canDeactivate: [CanDeactivateGuard],
                component: TestCreateComponent
            },
            {
                path: 'tests/:id/edit',
                canDeactivate: [CanDeactivateGuard],
                component: TestEditComponent
            },
            {
                path: 'tests/:id/statistic',
                component: TestStatisticComponent
            },
            {
                path: 'questions-pool/:id/edit',
                canDeactivate: [CanDeactivateGuard],
                component: QuestionsPoolEditComponent
            },
            {
                path: 'question/:id/edit',
                canDeactivate: [CanDeactivateGuard],
                component: QuestionEditComponent
            },
            {
                path: 'register-user',
                canDeactivate: [CanDeactivateGuard],
                component: RegisterUserComponent
            },
            {
                path: 'test-template-create',
                canDeactivate: [CanDeactivateGuard],
                component: TestTemplateCreateComponent
            },
            {
                path: 'test-templates/:id/edit',
                canDeactivate: [CanDeactivateGuard],
                component: TestTemplateEditComponent
            },
            {
                path: 'questions-pool/template/:id/edit',
                canDeactivate: [CanDeactivateGuard],
                component: QuestionsPoolTmplEditComponent
            },
            {
                path: 'question-template/:id/edit',
                canDeactivate: [CanDeactivateGuard],
                component: QuestionTmplEditComponent
            },
        ]
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        bindToComponentInputs: true,
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled"
    })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
