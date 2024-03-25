import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminMainComponent} from "./admin-main/admin-main.component";
import {AdminMainModule} from "./admin-main/admin-main.module";
import {TestsListComponent} from "./admin-main/tests-list/tests-list.component";
import {UsersListComponent} from "./admin-main/users-list/users-list.component";
import {LoginComponent} from "./auth/login/login.component";
import {EditUserItemComponent} from "./admin-main/edit-user-item/edit-user-item.component";
import {UserMainComponent} from "./user-main/user-main.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {TestsToPassListComponent} from "./user-main/tests-to-pass-list/tests-to-pass-list.component";
import {StartedTestsListComponent} from "./user-main/started-tests-list/started-tests-list.component";

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
            }
        ]
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
        path: 'admin',
        loadChildren: () => import('./admin-main/admin-main.module').then(m => m.AdminMainModule)
    },
    // {
    //     path: 'admin',
    //     component: AdminMainComponent,
    //     children: [
    //         {
    //             path: 'tests',
    //             component: TestsListComponent
    //         },
    //         {
    //             path: 'users',
    //             component: UsersListComponent
    //         },
    //         {
    //             path: 'users/:id/edit',
    //             component: EditUserItemComponent
    //         }
    //     ]
    // },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        bindToComponentInputs: true
    })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
