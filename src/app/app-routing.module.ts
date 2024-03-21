import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AdminMainComponent} from "./admin-main/admin-main.component";
import {AdminMainModule} from "./admin-main/admin-main.module";

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        //loadChildren: () => import('./admin-main/admin-main.module').then(m => m.AdminMainModule)
        component: AdminMainComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    } //Not Found Page
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
