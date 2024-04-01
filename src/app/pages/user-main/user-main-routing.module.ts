import {RouterModule, Routes} from "@angular/router";
import {AdminMainComponent} from "../admin-main/admin-main.component";
import {TestsListComponent} from "../admin-main/tests-list/tests-list.component";
import {UsersListComponent} from "../admin-main/users-list/users-list.component";
import {EditUserItemComponent} from "../admin-main/edit-user-item/edit-user-item.component";
import {NgModule} from "@angular/core";
import {UserMainComponent} from "./user-main.component";
import {TestsToPassListComponent} from "./tests-to-pass-list/tests-to-pass-list.component";
import {StartedTestsListComponent} from "./started-tests-list/started-tests-list.component";

const routes: Routes = [
    // {
    //     path: '',
    //     component: UserMainComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'all-tests',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'all-tests',
    //             component: TestsToPassListComponent
    //         },
    //         {
    //             path: 'started-tests',
    //             component: StartedTestsListComponent
    //         }
    //     ]
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserMainRoutingModule {
}
