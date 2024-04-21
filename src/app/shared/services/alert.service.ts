import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import {NavigationStart, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private keepAfterNavigationChange: boolean = true;
    private currentSnackBar: MatSnackBarRef<TextOnlySnackBar> | null = null;

    constructor(private snackBar: MatSnackBar, router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {

                    // only keep for many location changes
                    this.keepAfterNavigationChange = true;
                } else {
                    if(this.currentSnackBar)
                        this.currentSnackBar.dismiss();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange: boolean = true) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.currentSnackBar = this.snackBar.open(message, 'Close', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
    }

    error(message: string, keepAfterNavigationChange: boolean  = true) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.currentSnackBar = this.snackBar.open(message, 'Close', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
}
