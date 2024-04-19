import {Component} from '@angular/core';
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {UserModel} from "../../core/interfaces/user/user.model";
import {SelectFilter} from "../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../core/interfaces/filters/sort-criteria";
import {
    CREATION_DATE_SORT_CRITERIA,
    EMAIL_CONFIRMED_FILTER, MODIFICATION_DATE_SORT_CRITERIA,
    USER_ROLE_FILTER
} from "../../core/constants/filters.constants";
import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UsersPageService} from "./users.page.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {filter, Observable} from "rxjs";
import {FiltersService} from "../../shared/services/filters.service";
import {PagingService} from "../../shared/services/paging.service";
import {ViewModeService} from "../../shared/services/view-mode.service";

@UntilDestroy()
@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
    providers: [UsersPageService, FiltersService, PagingService]
})
export class UsersListComponent {
    pagedListOfUsers: PagedListModel<UserModel> | null = null;
    users: UserModel[] = [];

    selectFilters: SelectFilter[] = Array.of(USER_ROLE_FILTER, EMAIL_CONFIRMED_FILTER);
    sortCriterias: SortCriteria[] = Array.of(CREATION_DATE_SORT_CRITERIA, MODIFICATION_DATE_SORT_CRITERIA);

    viewMode$: Observable<string>;

    constructor(private usersPageService: UsersPageService,
                private dialog: MatDialog,
                viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$;
    }

    ngOnInit() {
        this.usersPageService.pagedListOfUsers$.pipe(untilDestroyed(this)).subscribe(
            response => {
                this.pagedListOfUsers = response;
                this.users = response?.items || [];
            }
        )
    }

    onDeleteUser(userId: string) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete user?',
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: dialogData
        });

        dialogRef
            .afterClosed()
            .pipe(
                untilDestroyed(this),
                filter((result) => result),
            )
            .subscribe(() => this.usersPageService.deleteUser(userId));
    }
}
