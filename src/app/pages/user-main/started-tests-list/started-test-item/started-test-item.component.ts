import {Component, Input} from '@angular/core';
import {StartedTestModel} from "../../../../core/interfaces/user-test/started-test.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-started-test-item',
  templateUrl: './started-test-item.component.html',
  styleUrl: './started-test-item.component.scss'
})
export class StartedTestItemComponent {
    @Input() startedTest!: StartedTestModel;

    constructor(private router: Router) {
    }

    checkOutResult(startedTest: StartedTestModel) {
        console.log("check out test result event emitted, testId: " + startedTest.test.id);
        this.router.navigate(['/test-result'], {
            queryParams: {id: startedTest.test.id}
        })
    }
}
