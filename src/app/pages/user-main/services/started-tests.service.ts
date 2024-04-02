import {Injectable} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {UserTestApiService} from "../../../core/services/api/user-test.api.service";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    Observable,
    of,
    switchMap,
    tap,
} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {StartedTestModel} from "../../../core/interfaces/user-test/started-test.model";
import {AuthService} from "../../../shared/services/auth.service";

@UntilDestroy()
@Injectable()
export class StartedTestsService {
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

    private pagedListSubject: BehaviorSubject<PagedListModel<StartedTestModel> | null> =
        new BehaviorSubject<PagedListModel<StartedTestModel> | null>(null);
    private fetchingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();
    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfStartedTests$: Observable<PagedListModel<StartedTestModel> | null> = this.pagedListSubject.asObservable();
    public fetching$: Observable<boolean> = this.fetchingSubject.asObservable();

    constructor(private userTestApiService: UserTestApiService,
                private authService: AuthService) {
        this.onFiltersAndPagingChange();
    }

    updateFilters(newFilters: Filters): void {
        this.filtersSubject.next(newFilters);
    }

    updatePagingSetting(newPagingSettings: PagingSettings) {
        this.pagingSettingSubject.next(newPagingSettings);
    }

    private onFiltersAndPagingChange(): void {
        combineLatest([this.filters$, this.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                tap(() => this.fetchingSubject.next(true)),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadStartedTestsList$(filters, pagedListSettings)
                    }
                ),
                tap(() => this.fetchingSubject.next(false))
            )
            .subscribe();
    }

    private loadStartedTestsList$(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userTestApiService
            .getAllStartedTestsForUser(
                this.authService.getUser().id,
                pagedListSettings,
                filters)
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
}
