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
export class StartedTestsPageService {
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

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();
    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfStartedTests$: Observable<PagedListModel<StartedTestModel> | null> = this.pagedListSubject.asObservable();

    constructor(private userTestApiService: UserTestApiService,
                private authService: AuthService) {
        this.onFiltersAndPagingChange();
    }

    updateFilters(newFilters: Filters): void {
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

    private onFiltersAndPagingChange(): void {
        combineLatest([this.filters$, this.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadStartedTestsList$(filters, pagedListSettings)
                    }
                ),
            )
            .subscribe();
    }

    private loadStartedTestsList$(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userTestApiService
            .getAllStartedTestsForUser(
                this.authService.getCurrentUser()!.id,
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
