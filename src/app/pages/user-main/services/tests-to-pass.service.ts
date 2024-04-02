import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    Observable, of,
    switchMap,
    tap
} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {UserTestApiService} from "../../../core/services/api/user-test.api.service";
import {AuthService} from "../../../shared/services/auth.service";
import {TestToPassModel} from "../../../core/interfaces/user-test/test-to-pass.model";

@UntilDestroy()
@Injectable()
export class TestsToPassService {
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

    private pagedListSubject: BehaviorSubject<PagedListModel<TestToPassModel> | null> =
        new BehaviorSubject<PagedListModel<TestToPassModel> | null>(null);
    private fetchingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();

    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfTestsToPass$: Observable<PagedListModel<TestToPassModel> | null> = this.pagedListSubject.asObservable();
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
                        return this.loadTestsToPassList$(filters, pagedListSettings)
                    }
                ),

            )
            .subscribe();
    }

    private loadTestsToPassList$(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userTestApiService
            .getAllTestsToPassForUser(
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
                }),
                tap(() => this.fetchingSubject.next(false))
            );
    }
}
