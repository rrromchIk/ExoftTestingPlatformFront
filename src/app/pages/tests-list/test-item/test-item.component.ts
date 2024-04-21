import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestModel} from "../../../core/interfaces/test/test.model";
import {Observable} from "rxjs";
import {ViewModeService} from "../../../shared/services/view-mode.service";

@Component({
    selector: 'app-test-item',
    templateUrl: './test-item.component.html',
    styleUrls: ['./test-item.component.scss']
})
export class TestItemComponent {
    @Input() test: TestModel;
    @Output() deleteTestEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() changePublishedStatusEvent: EventEmitter<TestModel> = new EventEmitter<TestModel>();

    viewMode$: Observable<string>;
    constructor(viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$;
    }

    onDeleteTest(test: TestModel) {
        this.deleteTestEvent.emit(test.id);
    }

    onUpdatePublishedStatus(test: TestModel) {
        console.log("emit change status event");
        this.changePublishedStatusEvent.emit(test)
    }
}
