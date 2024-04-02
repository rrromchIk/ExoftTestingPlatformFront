import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {TestTmplApiService} from "../../../core/services/api/test-tmpl.api.service";
import {TestTemplateModel} from "../../../core/interfaces/test-template/test-template.model";

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
    private fetchingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();
    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();
    public pagedListOfTestTemplates$: Observable<PagedListModel<TestTemplateModel> | null> = this.pagedListSubject.asObservable();
    public fetching$: Observable<boolean> = this.fetchingSubject.asObservable();

    constructor(private testTemplateApiService: TestTmplApiService) {
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
                        return this.loadTestTemplatesList$(filters, pagedListSettings)
                    }
                ),
                tap(() => this.fetchingSubject.next(false))
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
