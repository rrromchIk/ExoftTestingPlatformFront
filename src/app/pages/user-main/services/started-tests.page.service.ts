import {Injectable} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {UserTestApiService} from "../../../core/services/api/user-test.api.service";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    Observable,
    of,
    switchMap,
    tap,
} from "rxjs";
import {Filters} from "../../../core/interfaces/filters/filters";
import {PagingSettings} from "../../../core/interfaces/filters/paging-settings";
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {StartedTestModel} from "../../../core/interfaces/user-test/started-test.model";
import {AuthService} from "../../../shared/services/auth.service";
import {FiltersService} from "../../../shared/services/filters.service";
import {PagingService} from "../../../shared/services/paging.service";

@UntilDestroy()
@Injectable()
export class StartedTestsPageService {
    private pagedListSubject: BehaviorSubject<PagedListModel<StartedTestModel> | null> =
        new BehaviorSubject<PagedListModel<StartedTestModel> | null>(null);

    public pagedListOfStartedTests$: Observable<PagedListModel<StartedTestModel> | null> = this.pagedListSubject.asObservable();

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
                        return this.loadStartedTestsList(filters, pagedListSettings)
                    }
                ),
            )
            .subscribe();
    }

    private loadStartedTestsList(filters: Filters, pagedListSettings: PagingSettings) {
        return this.userTestApiService
            .getAllStartedTestsForUser(
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
