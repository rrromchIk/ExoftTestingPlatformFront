import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestResponseDto} from "../../../shared/models/test-response.dto";

@Component({
    selector: 'app-test-item',
    templateUrl: './test-item.component.html',
    styleUrls: ['./test-item.component.scss']
})
export class TestItemComponent {
    @Input() test!: TestResponseDto;
    @Output() deleteTestEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() changePublishedStatusEvent: EventEmitter<string> = new EventEmitter<string>();

    onDeleteTest(test: TestResponseDto) {
        this.deleteTestEvent.emit(test.id);
    }

    onUpdatePublishedStatus(test: TestResponseDto) {
        console.log("emit change status event");
        this.changePublishedStatusEvent.emit(test.id)
    }
}
