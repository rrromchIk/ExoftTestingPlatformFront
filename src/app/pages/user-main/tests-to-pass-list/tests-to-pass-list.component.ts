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
import {TestsToPassService} from "../services/tests-to-pass.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-tests-to-pass-list',
    templateUrl: './tests-to-pass-list.component.html',
    styleUrl: './tests-to-pass-list.component.scss',
    providers: [TestsToPassService]
})
export class TestsToPassListComponent implements OnInit {
    tests: TestToPassModel[] = [];
    pagedList: PagedListModel<TestToPassModel> | null = null;
    isFetching: boolean = true;

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA);


    constructor(private testsToPassService: TestsToPassService) {
    }

    ngOnInit(): void {
        this.testsToPassService.fetching$.pipe(untilDestroyed(this)).subscribe(
            value => this.isFetching = value
        )
        this.loadTestsToPass();
    }

    onPassTestEvent(testId: string) {
        console.log("Pass test event handled: " + testId);
    }

    loadTestsToPass(): void {
        this.testsToPassService.pagedListOfTestsToPass$.pipe(untilDestroyed(this)).subscribe(
            response => {
                this.pagedList = response;
                this.tests = response?.items || [];
            }
        )
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.testsToPassService.updatePagingSetting(pagingSetting);
    }

    onFilterChange(filters: Filters) {
        this.testsToPassService.updateFilters(filters);
    }
}
