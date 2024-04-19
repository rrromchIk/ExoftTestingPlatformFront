import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestTemplateModel} from "../../../core/interfaces/test-template/test-template.model";
import {ViewModeService} from "../../../shared/services/view-mode.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-test-template-item',
  templateUrl: './test-template-item.component.html',
  styleUrl: './test-template-item.component.scss'
})
export class TestTemplateItemComponent {
    @Input() testTemplate: TestTemplateModel;
    @Output() deleteTestTemplateEvent: EventEmitter<string> = new EventEmitter<string>();

    viewMode$: Observable<string>;
    constructor(viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$;
    }

    onDeleteTestTemplate(testTemplate: TestTemplateModel) {
        this.deleteTestTemplateEvent.emit(testTemplate.id);
    }
}
