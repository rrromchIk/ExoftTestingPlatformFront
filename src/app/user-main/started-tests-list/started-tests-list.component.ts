import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../shared/models/paged-list.model";
import {PagingSettings} from "../../shared/models/paging-settings";
import {UserTestService} from "../services/user-test.service";
import {StartedTestModel} from "../models/started-test.model";

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
        this.userTestService.getAllStartedTestsForUser("933c09e3-4116-4cde-d331-08dc45be50ce", this.pagingSettings)
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
}
