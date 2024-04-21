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
import {FiltersService} from "../../../shared/services/filters.service";
import {PagingService} from "../../../shared/services/paging.service";

@UntilDestroy()
@Injectable()
export class TestsToPassPageService {
    private pagedListSubject: BehaviorSubject<PagedListModel<TestToPassModel> | null> =
        new BehaviorSubject<PagedListModel<TestToPassModel> | null>(null);

    public pagedListOfTestsToPass$: Observable<PagedListModel<TestToPassModel> | null> = this.pagedListSubject.asObservable();

    constructor(private userTestApiService: UserTestApiService,
                private authService: AuthService,
                private filtersService: FiltersService,
                private pagingService: PagingService) {
        this.onFiltersAndPagingChange();
    }

    private onFiltersAndPagingChange() {
        combineLatest([this.filtersService.filters$, this.pagingService.pagingSetting$])
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
                catchError(() => {
                    this.pagedListSubject.next(null);
                    return of(null);
                })
            );
    }
}
