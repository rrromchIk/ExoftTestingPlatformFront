import {Component} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {UserModel} from "../../core/interfaces/user/user.model";

@Component({
    selector: 'app-admin-main',
    templateUrl: './admin-main.component.html',
    styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent {
    currentUser: UserModel | null;
    constructor(authService: AuthService) {
        this.currentUser = authService.getCurrentUser();
    }
}
