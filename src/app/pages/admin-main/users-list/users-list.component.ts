import {Component} from '@angular/core';
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {UserModel} from "../../../core/interfaces/user/user.model";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {UserService} from "../../../core/services/api/user.api.service";
import {SelectFilter} from "../../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../../core/interfaces/filters/sort-criteria";
import {Filters} from "../../../core/interfaces/filters/filters";
import {
    CREATION_DATE_SORT_CRITERIA,
    EMAIL_CONFIRMED_FILTER, MODIFICATION_DATE_SORT_CRITERIA,
    USER_ROLE_FILTER
} from "../../../core/constants/filters.constants";
import {DialogDataDto} from "../../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../../shared/components/dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
    pagedListOfUsers: PagedListModel<UserModel> | null = null;
    users: UserModel[] = [];
    isFetching: boolean = false;

    selectFilters: SelectFilter[] = Array.of(USER_ROLE_FILTER, EMAIL_CONFIRMED_FILTER);
    sortCriterias: SortCriteria[] = Array.of(CREATION_DATE_SORT_CRITERIA, MODIFICATION_DATE_SORT_CRITERIA);

    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    filters: Filters = {
        searchTerm: '',
        sortColumn: '',
        sortOrder: '',
        selectFilters: {},
    }

    constructor(private usersService: UserService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isFetching = true;
        this.usersService.getAllUsers(this.pagingSettings, this.filters)
            .subscribe(responseData => {
                    console.log("success get request");
                    this.pagedListOfUsers = responseData;
                    this.users = responseData.items;
                    this.isFetching = false;
                },
                error => {
                    this.pagedListOfUsers = null;
                    this.users = [];
                })
    }

    onDeleteUser(userId: string) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete user?',
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: dialogData
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.usersService.deleteUser(userId)
                    .subscribe(response => {
                        this.users = this.users.filter(user => user.id !== userId);
                        console.log(response);
                    }, error => {
                        console.log(error)
                    })
            }
        });
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadUsers();
    }

    onFilterChange(filters: Filters) {
        this.filters = filters;
        this.pagingSettings = {
            page: 1,
            pageSize: 3
        }
        this.loadUsers();
    }
}
