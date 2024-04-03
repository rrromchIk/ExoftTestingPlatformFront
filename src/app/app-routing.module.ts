import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserMainComponent} from "./pages/user-main/user-main.component";
import {TestsToPassListComponent} from "./pages/user-main/tests-to-pass-list/tests-to-pass-list.component";
import {StartedTestsListComponent} from "./pages/user-main/started-tests-list/started-tests-list.component";
import {PassingTestComponent} from "./pages/passing-test/passing-test/passing-test.component";
import {TestResultComponent} from "./pages/test-result/test-result/test-result.component";
import {LoginComponent} from "./pages/login/login/login.component";
import {SignupComponent} from "./pages/signup/signup/signup.component";
import {ForgotPasswordComponent} from "./pages/forgot-password/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./pages/reset-password/reset-password/reset-password.component";
import {AdminMainComponent} from "./pages/admin-main/admin-main.component";
import {TestsListComponent} from "./pages/admin-main/tests-list/tests-list.component";
import {UsersListComponent} from "./pages/admin-main/users-list/users-list.component";
import {EditUserItemComponent} from "./pages/admin-main/edit-user-item/edit-user-item.component";
import {TestTemplatesListComponent} from "./pages/admin-main/test-templates-list/test-templates-list.component";
import {TestCreateComponent} from "./pages/admin-main/test-create/test-create.component";


const routes: Routes = [
    {
        path: '',
        redirectTo: '/user-main',
        pathMatch: 'full'
    },
    // {
    //     path: 'user-main',
    //     loadChildren: () => import('./user-main/user-main.module').then(m => m.UserMainModule)
    // },
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
        ]
    },
    {
        path: 'pass-test',
        component: PassingTestComponent,
        canActivate: [AuthenticatedGuard]
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
    // {
    //     path: 'admin',
    //     loadChildren: () => import('./admin-main/admin-main.module').then(m => m.AdminMainModule)
    // },
    {
        path: 'admin',
        component: AdminMainComponent,
        canActivate: [AuthenticatedGuard, AdminGuard],
        children: [
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
                component: EditUserItemComponent
            },
            {
                path: 'test-templates',
                component: TestTemplatesListComponent
            },
            {
                path: 'test-create',
                component: TestCreateComponent
            }
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
        redirectTo: 'login',
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
