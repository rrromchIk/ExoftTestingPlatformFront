import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserResponseDto} from "../../../shared/models/user-response.dto";

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss', '../../../shared/styles/global.scss']

})
export class UserItemComponent {
    @Input() user!: UserResponseDto;
    @Output() deleteUserEvent: EventEmitter<string> = new EventEmitter<string>();

    onDeleteUser(user: UserResponseDto) {
        this.deleteUserEvent.emit(user.id);
    }
}
