import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestTemplateModel} from "../../../../core/interfaces/test-template/test-template.model";

@Component({
  selector: 'app-test-template-item',
  templateUrl: './test-template-item.component.html',
  styleUrl: './test-template-item.component.scss'
})
export class TestTemplateItemComponent {
    @Input() testTemplate!: TestTemplateModel;
    @Output() deleteTestTemplateEvent: EventEmitter<string> = new EventEmitter<string>();

    onDeleteTestTemplate(testTemplate: TestTemplateModel) {
        this.deleteTestTemplateEvent.emit(testTemplate.id);
    }
}
