import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../core/interfaces/filters/filters";
import {PagingSettings} from "../../core/interfaces/filters/paging-settings";
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TestModel} from "../../core/interfaces/test/test.model";
import {TestApiService} from "../../core/services/api/test.api.service";
import {Injectable} from "@angular/core";
import {AlertService} from "../../shared/services/alert.service";
import {FiltersService} from "../../shared/services/filters.service";
import {TestTmplApiService} from "../../core/services/api/test-tmpl.api.service";

@UntilDestroy()
@Injectable()
export class TestsPageService {
    private pagingSettingSubject: BehaviorSubject<PagingSettings> = new BehaviorSubject<PagingSettings>({
        page: 1,
        pageSize: 3
    });

    private pagedListSubject: BehaviorSubject<PagedListModel<TestModel> | null> =
        new BehaviorSubject<PagedListModel<TestModel> | null>(null);

    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfTests$: Observable<PagedListModel<TestModel> | null> = this.pagedListSubject.asObservable();

    constructor(private testApiService: TestApiService,
                private alertService: AlertService,
                private filtersService: FiltersService,
                private testTmplApiService: TestTmplApiService,) {
        this.onFiltersAndPagingChange();
    }

    updatePagingSetting(newPagingSettings: PagingSettings) {
        this.pagingSettingSubject.next(newPagingSettings);
    }

    updatePublishedStatus(test: TestModel) {
        this.testApiService.updatePublishedStatus(test.id, !test.isPublished)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success('Published status updated successfully')
                    this.refreshTests();
                },
                error: () => {
                    this.alertService.error('Unable to update test published status')
                }
            });
    }

    deleteTest(testId: string) {
        this.testApiService
            .deleteTest(testId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    if (
                        this.pagedListSubject.value?.hasPreviousPage &&
                        this.pagedListSubject.value?.items.length === 1
                    ) {
                        const pageListSettings = this.pagedListSubject.value;
                        pageListSettings.page -= 1;
                        this.pagingSettingSubject.next(pageListSettings);
                    }
                    this.alertService.success('Test deleted successfully');
                    this.refreshTests();
                },
                error: () => {
                    this.alertService.error('Unable to delete test');
                }
            });
    }

    loadTestTmplsShortInfo() {
        return this.testTmplApiService.getAllTestTmplsShortInfo();
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
        return this.testApiService
            .getAllTests(pagedListSettings, filters)
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

    private refreshTests() {
        const currentFilters = this.filtersService.getCurrentFilters();
        const currentPagedListSettings = this.pagingSettingSubject.value;
        this.loadTestsList(currentFilters, currentPagedListSettings).pipe(untilDestroyed(this)).subscribe();
    }
}
