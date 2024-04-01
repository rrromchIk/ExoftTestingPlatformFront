import {RouterModule, Routes} from "@angular/router";
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
