import {Component, Input} from '@angular/core';
import {TestToPassModel} from "../../../../core/interfaces/user-test/test-to-pass.model";
import {UserTestStatus} from "../../../../core/interfaces/user-test/user-test-status.enum";
import {Router} from "@angular/router";

@Component({
  selector: 'app-test-to-pass-item',
  templateUrl: './test-to-pass-item.component.html',
  styleUrl: './test-to-pass-item.component.scss'
})
export class TestToPassItemComponent {
    protected readonly UserTestStatus = UserTestStatus;
    @Input() testToPass!: TestToPassModel;

    constructor(private router: Router) {
    }

    onPassTest(test: TestToPassModel) {
        console.log("pass test event emitted, testId: " + test.id);
        this.router.navigate(['pass-test'], {
            queryParams: {id: test.id}
        })
    }

}
