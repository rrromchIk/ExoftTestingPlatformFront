import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../core/interfaces/filters/filters";
import {PagingSettings} from "../../core/interfaces/filters/paging-settings";
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {UserApiService} from "../../core/services/api/user.api.service";
import {UserModel} from "../../core/interfaces/user/user.model";
import {AlertService} from "../../shared/services/alert.service";
import {FiltersService} from "../../shared/services/filters.service";

@UntilDestroy()
@Injectable()
export class UsersPageService {
    private pagingSettingSubject: BehaviorSubject<PagingSettings> = new BehaviorSubject<PagingSettings>({
        page: 1,
        pageSize: 3
    });

    private pagedListSubject: BehaviorSubject<PagedListModel<UserModel> | null> =
        new BehaviorSubject<PagedListModel<UserModel> | null>(null);

    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfUsers$: Observable<PagedListModel<UserModel> | null> = this.pagedListSubject.asObservable();

    constructor(private userApiService: UserApiService,
                private alertService: AlertService,
                private filtersService: FiltersService) {
        this.onFiltersAndPagingChange();
    }

    // updateFilters(newFilters: Filters) {
    //     this.resetPagingSettings();
    //     this.filtersSubject.next(newFilters);
    // }

    updatePagingSetting(newPagingSettings: PagingSettings) {
        this.pagingSettingSubject.next(newPagingSettings);
    }

    deleteUser(testId: string) {
        this.userApiService
            .deleteUser(testId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    if(
                        this.pagedListSubject.value?.hasPreviousPage &&
                        this.pagedListSubject.value?.items.length === 1
                    ) {
                        const pageListSettings = this.pagedListSubject.value;
                        pageListSettings.page -= 1;
                        this.pagingSettingSubject.next(pageListSettings);
                    }
                    this.alertService.success('User deleted successfully');
                    this.refreshUsers();
                },
                error: () => {
                    this.alertService.error('Unable to delete user');
                }
            });
    }

    private onFiltersAndPagingChange() {
        combineLatest([this.filtersService.filters$, this.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadTestsList(filters, pagedListSettings)
                    }
                )
            )
            .subscribe();
    }

    private loadTestsList(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userApiService
            .getAllUsers(pagedListSettings, filters)
            .pipe(
                tap((pagedList) => {
                    this.pagedListSubject.next(pagedList);
                }),
                catchError(() => {
                    this.pagedListSubject.next(null);
                    return of(null);
                })
            );
    }

    private refreshUsers() {
        const currentFilters = this.filtersService.getCurrentFilters();
        const currentPagedListSettings = this.pagingSettingSubject.value;
        this.loadTestsList(currentFilters, currentPagedListSettings).pipe(untilDestroyed(this)).subscribe();
    }
}
