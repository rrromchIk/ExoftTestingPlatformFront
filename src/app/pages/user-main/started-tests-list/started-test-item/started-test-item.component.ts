import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StartedTestModel} from "../../../../core/interfaces/user-test/started-test.model";

@Component({
  selector: 'app-started-test-item',
  templateUrl: './started-test-item.component.html',
  styleUrl: './started-test-item.component.scss'
})
export class StartedTestItemComponent {
    @Input() startedTest!: StartedTestModel;
    @Output() checkOutResultEvent: EventEmitter<string> = new EventEmitter<string>();

    checkOutResult(startedTest: StartedTestModel) {
        this.checkOutResultEvent.emit(startedTest.test.id);
        console.log("check out test result event emitted, testId: " + startedTest.test.id);
    }
}
