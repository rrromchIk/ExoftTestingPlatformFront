import {Component, OnInit} from '@angular/core';
import {TestModel} from "../models/test.model";
import {PagedListModel} from "../../shared/models/paged-list.model";
import {PagingSettings} from "../../shared/models/paging-settings";
import {TestService} from "../services/test.service";


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
}
