import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminMainComponent} from './admin-main.component';
import {EditUserItemComponent} from "./edit-user-item/edit-user-item.component";
import {TestsListComponent} from "./tests-list/tests-list.component";
import {UsersListComponent} from "./users-list/users-list.component";

const routes: Routes = [
    // {
    //     path: '',
    //     component: AdminMainComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'tests',
    //             pathMatch: 'full'
    //         },
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
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminMainRoutingModule {
}
