import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../shared/services/auth.service";
import {AlertService} from "../../shared/services/alert.service";

export const AdminGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const alertService = inject(AlertService);
    const currentUser = authService.getCurrentUser();

    const userRole = currentUser?.role;
    if (userRole === 'Admin' || userRole === 'SuperAdmin') {
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
