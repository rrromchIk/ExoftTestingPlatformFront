import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthService} from "../../shared/services/auth.service";
import {AuthApiService} from "../../core/services/api/auth.api.service";
import {AlertService} from "../../shared/services/alert.service";

@UntilDestroy()
@Component({
    selector: 'app-email-confirm',
    templateUrl: './email-confirm.component.html',
    styleUrl: './email-confirm.component.scss'
})
export class EmailConfirmComponent implements OnInit {
    userId: string;
    token: string;
    confirmationSuccess: boolean | null = null;

    constructor(private route: ActivatedRoute,
                private authApiService: AuthApiService,
                private authService: AuthService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.route.queryParams
            .pipe(untilDestroyed(this))
            .subscribe((params) => {
                this.userId = params['userId'];
                this.token = params['token'];

                if (this.userId && this.token) {
                    this.authApiService.confirmEmail(this.userId, this.token)
                        .pipe(untilDestroyed(this))
                        .subscribe({
                            next: () => {
                                this.alertService.success('Email confirmed successfully');
                                this.confirmationSuccess = true;

                                const currentUser = this.authService.getCurrentUser();
                                if(currentUser != null) {
                                    currentUser.emailConfirmed = true;
                                    this.authService.setCurrentUser(currentUser);
                                }
                            },
                            error: (err) => {
                                this.confirmationSuccess = false;
                                this.alertService.error(err.error.detail || 'Failed to confirm email.')
                            }
                        })
                } else {
                    this.confirmationSuccess = false;
                    this.alertService.error('Invalid link')
                }
            });

    }
}
