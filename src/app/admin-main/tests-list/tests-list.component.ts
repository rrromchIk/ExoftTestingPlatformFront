import {Component, OnInit} from '@angular/core';
import {TestModel} from "../../core/interfaces/test.model";
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {PagingSettings} from "../../core/interfaces/paging-settings";
import {TestService} from "../../core/services/api/test.api.service";
import {SelectFilter} from "../../shared/interfaces/select-filter";
import {SortCriteria} from "../../shared/interfaces/sort-criteria";
import {Filters} from "../../shared/interfaces/filters";
import {
    CREATION_DATE_SORT_CRITERIA,
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
    FROM_TEMPLATE_FILTER,
    MODIFICATION_DATE_SORT_CRITERIA,
    PUBLISHED_FILTER
} from "../../core/constants/filters.constants";


@Component({
    selector: 'app-tests-list',
    templateUrl: './tests-list.component.html',
    styleUrls: ['./tests-list.component.scss']
})
export class TestsListComponent implements OnInit {
    tests: TestModel[] = [];
    pagedList: PagedListModel<TestModel> | null = null;
    isFetching: boolean = false;
    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER, PUBLISHED_FILTER, FROM_TEMPLATE_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA, MODIFICATION_DATE_SORT_CRITERIA);

    constructor(private testService: TestService) {
    }

    ngOnInit(): void {
        this.loadTests();
    }

    loadTests(): void {
        this.isFetching = true;
        this.testService.getAllTests(this.pagingSettings)
            .subscribe(responseData => {
                console.log(responseData);
                this.pagedList = responseData;
                this.tests = responseData.items;
                this.isFetching = false;
            })
    }

    onDeleteTest(testId: string) {
        window.alert("Are u sure u want to delete?")
        this.testService.deleteTest(testId)
            .subscribe(response => {
                this.tests = this.tests.filter(test => test.id !== testId);
                console.log(response);
            }, error => {
                console.log(error)
            })
    }

    onChangePublishedStatus(testId: string) {
        const testToUpdateStatus = this.tests.find(t => t.id == testId);

        if (testToUpdateStatus != null) {
            this.testService.updatePublishedStatus(testId, !testToUpdateStatus.isPublished)
                .subscribe(response => {
                    console.log(response)
                    testToUpdateStatus.isPublished = !testToUpdateStatus.isPublished;
                    testToUpdateStatus.modifiedTimestamp = new Date();
                }, error => {
                    console.log(error)
                })
        }
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadTests();
    }

    onFilterChange(filtersDto: Filters) {
        console.log('Filter change event:', filtersDto);
    }
}
