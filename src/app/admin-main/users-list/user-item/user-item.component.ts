import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserModel} from "../../../shared/models/user.model";

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss']

})
export class UserItemComponent {
    @Input() user!: UserModel;
    @Output() deleteUserEvent: EventEmitter<string> = new EventEmitter<string>();

    onDeleteUser(user: UserModel) {
        this.deleteUserEvent.emit(user.id);
    }
}
