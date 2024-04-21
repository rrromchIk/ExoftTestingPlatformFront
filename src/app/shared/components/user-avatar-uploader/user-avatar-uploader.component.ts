import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-user-avatar-uploader',
  templateUrl: './user-avatar-uploader.component.html',
  styleUrl: './user-avatar-uploader.component.scss'
})
export class UserAvatarUploaderComponent {
    @Input() imageUrl: string | null = null;
    @Output() imageUploadedEvent: EventEmitter<File> = new EventEmitter<File>();
    showDefaultImage: boolean = false;


    onFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length) {
            this.imageUploadedEvent.emit(inputElement.files[0]);

            this.showDefaultImage = false;
        }
    }

    showDefault() {
        console.log("error loading image file");
        this.showDefaultImage = true;
    }
}
