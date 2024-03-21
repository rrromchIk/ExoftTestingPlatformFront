import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminMainComponent} from './admin-main.component';
import {EditUserItemComponent} from "./edit-user-item/edit-user-item.component";

const routes: Routes = [{
        path: '',
        component: AdminMainComponent,
        children: [
            {
                //path: 'users/:id/edit',
                path: 'users',
                component: EditUserItemComponent
            }
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminMainRoutingModule {
}
