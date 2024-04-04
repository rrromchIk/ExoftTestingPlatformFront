import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../../core/interfaces/user/user.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    currentUser!: UserModel | null;
    constructor(private authService: AuthService) {}

    logOut() {
        this.authService.logout();
    }

    ngOnInit(): void {
        this.authService.currentUser$
            .pipe(untilDestroyed(this))
            .subscribe(
            data => this.currentUser = data
        )
    }
}
