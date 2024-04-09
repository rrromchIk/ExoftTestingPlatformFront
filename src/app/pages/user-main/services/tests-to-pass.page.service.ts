import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    Observable, of,
    switchMap,
    tap
} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/filters/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {UserTestApiService} from "../../../core/services/api/user-test.api.service";
import {AuthService} from "../../../shared/services/auth.service";
import {TestToPassModel} from "../../../core/interfaces/user-test/test-to-pass.model";

@UntilDestroy()
@Injectable()
export class TestsToPassPageService {
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

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();

    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfTestsToPass$: Observable<PagedListModel<TestToPassModel> | null> = this.pagedListSubject.asObservable();

    constructor(private userTestApiService: UserTestApiService,
                private authService: AuthService) {
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

    private onFiltersAndPagingChange() {
        combineLatest([this.filters$, this.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadTestsToPassList(filters, pagedListSettings)
                    }
                )
            )
            .subscribe();
    }

    private loadTestsToPassList(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userTestApiService
            .getAllTestsToPassForUser(
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
