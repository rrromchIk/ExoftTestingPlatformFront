import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserModel} from "../../../../core/interfaces/user/user.model";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent {
    @Input() user!: UserModel;
    @Output() deleteUserEvent: EventEmitter<string> = new EventEmitter<string>();
    currentUser: UserModel | null;

    constructor(authService: AuthService) {
        this.currentUser = authService.getCurrentUser();
    }

    onDeleteUser(user: UserModel) {
        this.deleteUserEvent.emit(user.id);
    }

    canModifyUser() {
        const currentUserRole = this.currentUser?.role;
        if (currentUserRole === 'SuperAdmin') {
            // SuperAdmin cannot edit or delete their own account
            return this.currentUser?.id !== this.user.id;
        } else {
            // Regular Admin can edit or delete other users, not themselves
            return !(currentUserRole === 'Admin' && (this.user.role === 'Admin' || this.user.role === 'SuperAdmin'));
        }
    }
}
