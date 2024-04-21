import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserModel} from "../../../core/interfaces/user/user.model";
import {AuthService} from "../../../shared/services/auth.service";
import {UserRole} from "../../../core/interfaces/user/user-role.enum";
import {ViewModeService} from "../../../shared/services/view-mode.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent {
    @Input() user: UserModel;
    @Output() deleteUserEvent: EventEmitter<string> = new EventEmitter<string>();
    currentUser: UserModel | null;

    viewMode$: Observable<string>
    constructor(authService: AuthService,
                viewModeService: ViewModeService) {
        this.currentUser = authService.getCurrentUser();
        this.viewMode$ = viewModeService.viewMode$;
    }

    onDeleteUser(user: UserModel) {
        this.deleteUserEvent.emit(user.id);
    }

    canModifyUser() {
        const currentUserRole = this.currentUser?.role;

        if (currentUserRole === UserRole.SuperAdmin) {
            return this.currentUser?.id !== this.user.id;
        } else if(currentUserRole == UserRole.Admin){
            const userToModifyIsAdminOrSuperAdmin = this.user.role === UserRole.Admin || this.user.role === UserRole.SuperAdmin;
            return !userToModifyIsAdminOrSuperAdmin;
        }

        return false;
    }
}
