import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogDataDto} from "../../../core/interfaces/dialog/dialog-data.dto";

@Component({
    selector: 'app-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogDataDto
    ) {}

    onConfirmClick() {
        this.dialogRef.close(true);
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }
}
