import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {TestTmplApiService} from "../../../core/services/api/test-tmpl.api.service";
import {TestTemplateModel} from "../../../core/interfaces/test-template/test-template.model";
import {AlertService} from "../../../shared/services/alert.service";

@UntilDestroy()
@Injectable()
export class TestTemplatesPageService {
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

    private pagedListSubject: BehaviorSubject<PagedListModel<TestTemplateModel> | null> =
        new BehaviorSubject<PagedListModel<TestTemplateModel> | null>(null);
    public filters$: Observable<Filters> = this.filtersSubject.asObservable();
    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfTestTemplates$: Observable<PagedListModel<TestTemplateModel> | null> = this.pagedListSubject.asObservable();

    constructor(private testTemplateApiService: TestTmplApiService,
                private alertService: AlertService) {
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
                        this.pagingSettingSubject.next(pageListSettings);
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
        combineLatest([this.filters$, this.pagingSetting$])
            .pipe(
                untilDestroyed(this),
                switchMap(([filters, pagedListSettings]) => {
                        return this.loadTestTemplatesList$(filters, pagedListSettings)
                    }
                ),
            )
            .subscribe();
    }

    private loadTestTemplatesList$(filters: Filters, pagedListSettings: PagingSettings) {
        return this.testTemplateApiService
            .getAllTestTemplates(pagedListSettings, filters)
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
        this.loadTestTemplatesList$(currentFilters, currentPagedListSettings).pipe(untilDestroyed(this)).subscribe();
    }
}
