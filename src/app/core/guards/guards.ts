import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../shared/services/auth.service";

export const AdminGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();

    const userRole = currentUser?.role;
    console.log(currentUser);
    console.log(userRole);
    if (userRole === 'Admin' || userRole === 'SuperAdmin') {
        console.log("adminGuard::allowed");

        return true;
    } else {
        console.log("adminGuard::forbidden");
        router.navigate(['/forbidden']); // Navigate to access denied page
        return false;
    }
}

export const AuthenticatedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.getCurrentUser()) {
        console.log("AuthenticatedGuard::allowed");
        return true;
    }

    console.log("AuthenticatedGuard::forbidden");
    router.navigate(['/login']);
    return false;
}
