import {Component} from '@angular/core';
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {UserModel} from "../../core/interfaces/user.model";
import {PagingSettings} from "../../core/interfaces/paging-settings";
import {UserService} from "../../core/services/api/user.api.service";

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
    pagedListOfUsers: PagedListModel<UserModel> | null = null;
    users: UserModel[] = [];
    isFetching: boolean = false;
    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    constructor(private usersService: UserService) {
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isFetching = true;
        this.usersService.getAllUsers(this.pagingSettings)
            .subscribe(responseData => {
                this.pagedListOfUsers = responseData;
                this.users = responseData.items;
                this.isFetching = false;
            })
    }

    onDeleteUser(userId: string) {
        window.alert("Are u sure u want to delete?")
        this.usersService.deleteUser(userId)
            .subscribe(response => {
                this.users = this.users.filter(user => user.id !== userId);
                console.log(response);
            }, error => {
                console.log(error)
            })
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadUsers();
    }
}
