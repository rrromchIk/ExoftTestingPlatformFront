import {CanActivateFn, CanDeactivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../shared/services/auth.service";
import {AlertService} from "../../shared/services/alert.service";
import {UserTestApiService} from "../services/api/user-test.api.service";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {UserTestStatus} from "../interfaces/user-test/user-test-status.enum";
import {HttpStatusCode} from "@angular/common/http";
import {UserRole} from "../interfaces/user/user-role.enum";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogDataDto} from "../interfaces/dialog/dialog-data.dto";

export const AdminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const alertService = inject(AlertService);
    const currentUser = authService.getCurrentUser();

    const userRole = currentUser?.role;
    if (userRole === UserRole.Admin || userRole === UserRole.SuperAdmin) {
        console.log("adminGuard::allowed");

        return true;
    } else {
        console.log("adminGuard::forbidden");
        alertService.error('Access denied');
        router.navigate(['/forbidden']); // Navigate to access denied page
        return false;
    }
}

export const AuthenticatedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const alertService = inject(AlertService);

    if(authService.getCurrentUser()) {
        console.log("AuthenticatedGuard::allowed");
        return true;
    }

    console.log("AuthenticatedGuard::forbidden");
    alertService.error('In order to access requested page, please login');
    router.navigate(['/login']);
    return false;
}

export const PassingTestGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const alertService = inject(AlertService);
    const userTestApiService = inject(UserTestApiService);

    const testId = route.queryParamMap.get("id")!;
    const currentUserId = authService.getCurrentUser().id;

    return userTestApiService.getUserTest(currentUserId, testId)
        .pipe(
            map(
                (userTest) => {
                    const testCompleted = userTest.userTestStatus === UserTestStatus.Completed;

                    if(testCompleted) {
                        console.log("PassingTestGuard::forbidden");
                        alertService.error('Test already completed', true);
                        router.navigate(['/user-main']);
                        return false;
                    }

                    console.log("PassingTestGuard::allowed");
                    return true;
                },
            ),
            catchError((err) => {
                if(err.status === HttpStatusCode.NotFound)
                    return of(true)
                else
                    return throwError(() => err)
            }),
        )
}


export interface CanDeactivateComponent {
    canDeactivate(): Observable<boolean> | boolean;
}

export const CanDeactivateGuard: CanDeactivateFn<CanDeactivateComponent> = (component: CanDeactivateComponent) => {
    const canDeactivateComponent = component.canDeactivate();
    const matDialog = inject(MatDialog);

    if (!canDeactivateComponent) {
        const dialogData: DialogDataDto = {
            title: 'You have unsaved changes',
            content: 'Are you sure you want to leave?'
        };

        return matDialog.open(ConfirmationDialogComponent, {
            data: dialogData
        }).afterClosed()
    }

    return true;
}

