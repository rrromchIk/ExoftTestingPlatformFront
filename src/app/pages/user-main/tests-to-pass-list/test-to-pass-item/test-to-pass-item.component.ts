import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestToPassModel} from "../../../../core/interfaces/user-test/test-to-pass.model";
import {UserTestStatus} from "../../../../core/interfaces/user-test/user-test-status.enum";

@Component({
  selector: 'app-test-to-pass-item',
  templateUrl: './test-to-pass-item.component.html',
  styleUrl: './test-to-pass-item.component.scss'
})
export class TestToPassItemComponent {
    protected readonly UserTestStatus = UserTestStatus;
    @Input() testToPass!: TestToPassModel;
    @Output() passTestEvent: EventEmitter<string> = new EventEmitter<string>();

    onPassTest(test: TestToPassModel) {
        this.passTestEvent.emit(test.id);
        console.log("pass test event emitted, testId: " + test.id);
    }

}
