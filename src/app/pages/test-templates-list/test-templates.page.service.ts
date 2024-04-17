import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../core/interfaces/filters/filters";
import {PagingSettings} from "../../core/interfaces/filters/paging-settings";
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {TestTmplApiService} from "../../core/services/api/test-tmpl.api.service";
import {TestTemplateModel} from "../../core/interfaces/test-template/test-template.model";
import {AlertService} from "../../shared/services/alert.service";
import {FiltersService} from "../../shared/services/filters.service";
import {PagingService} from "../../shared/services/paging.service";

@UntilDestroy()
@Injectable()
export class TestTemplatesPageService {
    private pagedListSubject: BehaviorSubject<PagedListModel<TestTemplateModel> | null> =
        new BehaviorSubject<PagedListModel<TestTemplateModel> | null>(null);
    public pagedListOfTestTemplates$: Observable<PagedListModel<TestTemplateModel> | null> = this.pagedListSubject.asObservable();

    constructor(private testTemplateApiService: TestTmplApiService,
                private alertService: AlertService,
                private filtersService: FiltersService,
                private pagingService: PagingService) {
        this.onFiltersAndPagingChange();
    }

    deleteTestTemplate(testTmplId: string) {
        this.testTemplateApiService
            .deleteTestTemplate(testTmplId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    if(
                        this.pagedListSubject.value?.hasPreviousPage &&
                        this.pagedListSubject.value?.items.length === 1
                    ) {
                        const pageListSettings = this.pagedListSubject.value;
                        pageListSettings.page -= 1;
                        this.pagingService.updatePagingSettings(pageListSettings);
                    }

                    this.alertService.success('Test template deleted successfully');
                    this.refreshTests();
                },
                error: () => {
                    this.alertService.error('Unable to delete test template');
                }
            });
    }

    private onFiltersAndPagingChange() {
        combineLatest([this.filtersService.filters$, this.pagingService.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadTestTemplatesList(filters, pagedListSettings)
                    }
                ),
            )
            .subscribe();
    }

    private loadTestTemplatesList(filters: Filters, pagedListSettings: PagingSettings) {
        return this.testTemplateApiService
            .getAllTestTemplates(pagedListSettings, filters)
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
        const currentPagedListSettings = this.pagingService.getCurrentPagingSettings();
        this.loadTestTemplatesList(currentFilters, currentPagedListSettings).pipe(untilDestroyed(this)).subscribe();
    }
}
