import {Component, Input} from '@angular/core';
import {StartedTestModel} from "../../../../../core/interfaces/user-test/started-test.model";
import {Router} from "@angular/router";
import {UserTestStatus} from "../../../../../core/interfaces/user-test/user-test-status.enum";
import {TestModel} from "../../../../../core/interfaces/test/test.model";

@Component({
  selector: 'app-started-test-item',
  templateUrl: './started-test-item.component.html',
  styleUrl: './started-test-item.component.scss'
})
export class StartedTestItemComponent {
    protected readonly UserTestStatus = UserTestStatus;
    @Input() startedTest: StartedTestModel;

    constructor(private router: Router) {}

    checkOutResult(startedTest: StartedTestModel) {
        this.router.navigate(['/test-result'], {
            queryParams: {id: startedTest.test.id}
        })
    }

    onPassTest(test: TestModel) {
        this.router.navigate(['pass-test'], {
            queryParams: {id: test.id}
        })
    }
}
