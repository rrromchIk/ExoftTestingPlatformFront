import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../../../core/interfaces/paged-list.model";
import {StartedTestModel} from "../../../../core/interfaces/user-test/started-test.model";
import {SelectFilter} from "../../../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../../../core/interfaces/filters/sort-criteria";
import {
    DIFFICULTY_FILTER,
    SCORE_SORT_CRITERIA, STARTING_TIME_SORT_CRITERIA,
    USER_TEST_STATUS_FILTER
} from "../../../../core/constants/filters.constants";
import {StartedTestsPageService} from "../../services/started-tests.page.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FiltersService} from "../../../../shared/services/filters.service";
import {PagingService} from "../../../../shared/services/paging.service";

@UntilDestroy()
@Component({
    selector: 'app-started-tests-list',
    templateUrl: './started-tests-list.component.html',
    styleUrl: './started-tests-list.component.scss',
    providers: [StartedTestsPageService, FiltersService, PagingService]
})
export class StartedTestsListComponent implements OnInit {
    startedTests: StartedTestModel[] = [];
    pagedList: PagedListModel<StartedTestModel> | null = null;

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER, USER_TEST_STATUS_FILTER);
    sortCriterias: SortCriteria[] = Array.of(STARTING_TIME_SORT_CRITERIA, SCORE_SORT_CRITERIA);

    constructor(private startedTestsService: StartedTestsPageService) {
    }

    ngOnInit() {
        this.startedTestsService.pagedListOfStartedTests$
            .pipe(untilDestroyed(this))
            .subscribe(
                response => {
                    this.pagedList = response;
                    this.startedTests = response?.items || [];
                }
            )
    }
}
