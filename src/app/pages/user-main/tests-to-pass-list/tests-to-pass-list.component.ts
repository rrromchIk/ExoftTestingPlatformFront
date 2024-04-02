import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {PagingSettings} from "../../../core/interfaces/paging-settings";
import {TestToPassModel} from "../../../core/interfaces/user-test/test-to-pass.model";
import {UserTestApiService} from "../../../core/services/api/user-test.api.service";
import {SelectFilter} from "../../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../../core/interfaces/filters/sort-criteria";
import {Filters} from "../../../core/interfaces/filters/filters";
import {
    CREATION_DATE_SORT_CRITERIA,
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
} from "../../../core/constants/filters.constants";

@Component({
    selector: 'app-tests-to-pass-list',
    templateUrl: './tests-to-pass-list.component.html',
    styleUrl: './tests-to-pass-list.component.scss'
})
export class TestsToPassListComponent implements OnInit {
    tests: TestToPassModel[] = [];
    pagedList: PagedListModel<TestToPassModel> | null = null;
    isFetching: boolean = false;

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA);

    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    filters: Filters = {
        searchTerm: '',
        sortColumn: '',
        sortOrder: '',
        selectFilters: {},
    }

    constructor(private userTestService: UserTestApiService) {
    }

    ngOnInit(): void {
        this.loadTestsToPass();
    }

    onPassTestEvent(testId: string) {
        console.log("Pass test event handled")
    }

    loadTestsToPass(): void {
        this.isFetching = true;
        this.userTestService.getAllTestsToPassForUser("f9884071-88d7-46af-d332-08dc45be50ce",
            this.pagingSettings, this.filters)
            .subscribe(responseData => {
                    console.log(responseData);
                    this.pagedList = responseData;
                    this.tests = responseData.items;
                    this.isFetching = false;
                },
                error => {
                    this.pagedList = null;
                    this.tests = [];
                })
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadTestsToPass();
    }

    onFilterChange(filters: Filters) {
        this.filters = filters;
        this.pagingSettings = {
            page: 1,
            pageSize: 3
        }
        this.loadTestsToPass();
    }
}
