import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {PagingSettings} from "../../core/interfaces/paging-settings";
import {UserTestService} from "../../core/services/api/user-test.api.service";
import {StartedTestModel} from "../../core/interfaces/started-test.model";
import {SelectFilter} from "../../shared/interfaces/select-filter";
import {SortCriteria} from "../../shared/interfaces/sort-criteria";
import {FiltersDto} from "../../shared/interfaces/filters-dto";
import {
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
    SCORE_SORT_CRITERIA, STARTING_TIME_SORT_CRITERIA,
    USER_TEST_STATUS_FILTER
} from "../../core/constants/filters.constants";

@Component({
  selector: 'app-started-tests-list',
  templateUrl: './started-tests-list.component.html',
  styleUrl: './started-tests-list.component.scss'
})
export class StartedTestsListComponent implements OnInit {
    startedTests: StartedTestModel[] = [];
    pagedList: PagedListModel<StartedTestModel> | null = null;
    isFetching: boolean = false;
    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER, USER_TEST_STATUS_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, STARTING_TIME_SORT_CRITERIA, SCORE_SORT_CRITERIA);

    constructor(private userTestService: UserTestService) {
    }

    ngOnInit(): void {
        this.loadStartedTests();
    }

    onCheckOutTestResultsEvent(testId: string) {
        console.log("onCheckOutTestResultsEvent handled")
    }

    loadStartedTests(): void {
        this.isFetching = true;
        this.userTestService.getAllStartedTestsForUser("f9884071-88d7-46af-d332-08dc45be50ce", this.pagingSettings)
            .subscribe(responseData => {
                console.log(responseData);
                this.pagedList = responseData;
                this.startedTests = responseData.items;
                this.isFetching = false;
            })
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadStartedTests();
    }

    onFilterChange(filtersDto: FiltersDto) {
        console.log('Filter change event:', filtersDto);
    }
}
