import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestModel} from "../../../core/interfaces/test.model";

@Component({
    selector: 'app-test-item',
    templateUrl: './test-item.component.html',
    styleUrls: ['./test-item.component.scss']
})
export class TestItemComponent {
    @Input() test!: TestModel;
    @Output() deleteTestEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() changePublishedStatusEvent: EventEmitter<string> = new EventEmitter<string>();

    onDeleteTest(test: TestModel) {
        this.deleteTestEvent.emit(test.id);
    }

    onUpdatePublishedStatus(test: TestModel) {
        console.log("emit change status event");
        this.changePublishedStatusEvent.emit(test.id)
    }
}
