import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(private snackBar: MatSnackBar) {
    }

    success(message: string) {
        this.snackBar.open(message, 'Close', { duration: 8000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
    }

    error(message: string) {
        this.snackBar.open(message, 'Close', { duration: 8000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
}
