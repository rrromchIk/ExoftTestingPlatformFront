import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {UserApiService} from "../../../core/services/api/user.api.service";
import {UserModel} from "../../../core/interfaces/user/user.model";

@UntilDestroy()
@Injectable()
export class UsersPageService {
    private filtersSubject: BehaviorSubject<Filters> = new BehaviorSubject<Filters>({
        searchTerm: '',
        sortColumn: '',
        sortOrder: '',
        selectFilters: {},
    });

    private pagingSettingSubject: BehaviorSubject<PagingSettings> = new BehaviorSubject<PagingSettings>({
        page: 1,
        pageSize: 3
    });

    private pagedListSubject: BehaviorSubject<PagedListModel<UserModel> | null> =
        new BehaviorSubject<PagedListModel<UserModel> | null>(null);
    private fetchingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();
    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfUsers$: Observable<PagedListModel<UserModel> | null> = this.pagedListSubject.asObservable();
    public fetching$: Observable<boolean> = this.fetchingSubject.asObservable();

    constructor(private userApiService: UserApiService) {
        this.onFiltersAndPagingChange();
    }

    updateFilters(newFilters: Filters) {
        this.resetPagingSettings();
        this.filtersSubject.next(newFilters);
    }

    updatePagingSetting(newPagingSettings: PagingSettings) {
        this.pagingSettingSubject.next(newPagingSettings);
    }

    private resetPagingSettings() {
        this.pagingSettingSubject.next({
            page: 1,
            pageSize: 3
        });
    }

    deleteUser(testId: string) {
        this.userApiService
            .deleteUser(testId)
            .pipe(
                untilDestroyed(this),
                tap(() => {
                    if(
                        this.pagedListSubject.value?.hasPreviousPage &&
                        this.pagedListSubject.value?.items.length === 1
                    ) {
                        const pageListSettings = this.pagedListSubject.value;
                        pageListSettings.page -= 1;
                        this.pagingSettingSubject.next(pageListSettings);
                    }
                    this.refreshUsers();
                }),
                catchError((error) => {
                    console.error('Error deleting test:', error);
                    return of(null);
                }),
            )
            .subscribe();
    }

    private onFiltersAndPagingChange() {
        combineLatest([this.filters$, this.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                tap(() => this.fetchingSubject.next(true)),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadTestsList$(filters, pagedListSettings)
                    }
                ),
                tap(() => this.fetchingSubject.next(false))
            )
            .subscribe();
    }

    private loadTestsList$(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userApiService
            .getAllUsers(pagedListSettings, filters)
            .pipe(
                tap((pagedList) => {
                    this.pagedListSubject.next(pagedList);
                }),
                catchError((error) => {
                    this.pagedListSubject.next(null);
                    return of(null);
                })
            );
    }

    private refreshUsers() {
        const currentFilters = this.filtersSubject.value;
        const currentPagedListSettings = this.pagingSettingSubject.value;
        this.loadTestsList$(currentFilters, currentPagedListSettings).pipe(untilDestroyed(this)).subscribe();
    }
}
