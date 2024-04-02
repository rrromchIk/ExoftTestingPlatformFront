import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TestModel} from "../../../core/interfaces/test/test.model";
import {TestApiService} from "../../../core/services/api/test.api.service";
import {Injectable} from "@angular/core";

@UntilDestroy()
@Injectable()
export class TestsPageService {
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

    private pagedListSubject: BehaviorSubject<PagedListModel<TestModel> | null> =
        new BehaviorSubject<PagedListModel<TestModel> | null>(null);
    private fetchingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();
    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfTests$: Observable<PagedListModel<TestModel> | null> = this.pagedListSubject.asObservable();
    public fetching$: Observable<boolean> = this.fetchingSubject.asObservable();

    constructor(private testApiService: TestApiService) {
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

    updatePublishedStatus(test: TestModel) {
        this.testApiService.updatePublishedStatus(test.id, !test.isPublished)
            .pipe(
                untilDestroyed(this),
                tap(() => {
                    this.refreshTests();
                }), catchError((error) => {
                    console.error('Error deleting test:', error);
                    return of(null);
                })
            )
            .subscribe();
    }

    deleteTest(testId: string) {
        this.testApiService
            .deleteTest(testId)
            .pipe(
                untilDestroyed(this),
                tap(() => {
                    this.refreshTests();
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
        return this.testApiService
            .getAllTests(pagedListSettings, filters)
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

    private refreshTests() {
        const currentFilters = this.filtersSubject.value;
        const currentPagedListSettings = this.pagingSettingSubject.value;
        this.loadTestsList$(currentFilters, currentPagedListSettings).pipe(untilDestroyed(this)).subscribe();
    }
}
