import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestToPassModel} from "../../../shared/models/test-to-pass.model";

@Component({
  selector: 'app-test-to-pass-item',
  templateUrl: './test-to-pass-item.component.html',
  styleUrl: './test-to-pass-item.component.scss'
})
export class TestToPassItemComponent {
    @Input() testToPass!: TestToPassModel;
    @Output() passTestEvent: EventEmitter<string> = new EventEmitter<string>();

    onPassTest(test: TestToPassModel) {
        this.passTestEvent.emit(test.id);
        console.log("pass test event emitted, testId: " + test.id);
    }
}
