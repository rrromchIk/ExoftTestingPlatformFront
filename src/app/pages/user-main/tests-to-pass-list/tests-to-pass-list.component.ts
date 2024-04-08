import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../../core/interfaces/paged-list.model";
import {PagingSettings} from "../../../core/interfaces/filters/paging-settings";
import {TestToPassModel} from "../../../core/interfaces/user-test/test-to-pass.model";
import {SelectFilter} from "../../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../../core/interfaces/filters/sort-criteria";
import {Filters} from "../../../core/interfaces/filters/filters";
import {
    CREATION_DATE_SORT_CRITERIA,
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
} from "../../../core/constants/filters.constants";
import {TestsToPassPageService} from "../services/tests-to-pass.page.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-tests-to-pass-list',
    templateUrl: './tests-to-pass-list.component.html',
    styleUrl: './tests-to-pass-list.component.scss',
    providers: [TestsToPassPageService]
})
export class TestsToPassListComponent implements OnInit {
    tests: TestToPassModel[] = [];
    pagedList: PagedListModel<TestToPassModel> | null = null;

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA);


    constructor(private testsToPassService: TestsToPassPageService) {
    }

    ngOnInit(): void {
        this.loadTestsToPass();
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
