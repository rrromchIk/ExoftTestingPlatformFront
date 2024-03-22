import {Component, OnInit} from '@angular/core';
import {TestResponseDto} from "../../shared/models/test-response.dto";
import {PagedListDto} from "../../shared/models/paged-list.dto";
import {PagingSettings} from "../../shared/models/paging-settings";
import {TestService} from "../../admin-main/services/test.service";
import {TestToPassDto} from "../../shared/models/test-to-pass.dto";
import {UserTestService} from "../services/user-test.service";

@Component({
  selector: 'app-tests-to-pass-list',
  templateUrl: './tests-to-pass-list.component.html',
  styleUrl: './tests-to-pass-list.component.scss'
})
export class TestsToPassListComponent implements OnInit {
    tests: TestToPassDto[] = [];
    pagedList: PagedListDto<TestToPassDto> | null = null;
    isFetching: boolean = false;
    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    constructor(private userTestService: UserTestService) {
    }

    ngOnInit(): void {
        this.loadTests();
    }

    onPassTestEvent(testId: string) {
        console.log("Pass test event handled")
    }

    loadTests(): void {
        this.isFetching = true;
        this.userTestService.getAllTestsToPassForUser("933c09e3-4116-4cde-d331-08dc45be50ce", this.pagingSettings)
            .subscribe(responseData => {
                console.log(responseData);
                this.pagedList = responseData;
                this.tests = responseData.items;
                this.isFetching = false;
            })
    }

    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadTests();
    }
}
