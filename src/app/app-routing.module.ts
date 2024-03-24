import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AdminMainComponent} from "./admin-main/admin-main.component";
import {AdminMainModule} from "./admin-main/admin-main.module";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/user-main',
        pathMatch: 'full'
    },
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
    // {
    //     path: 'admin',
    //     loadChildren: () => import('./admin-main/admin-main.module').then(m => m.AdminMainModule)
    // },
    {
        path: 'admin',
        //loadChildren: () => import('./admin-main/admin-main.module').then(m => m.AdminMainModule)
        component: AdminMainComponent
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        bindToComponentInputs: true
    }),
        AdminMainModule],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
