import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-user-avatar-uploader',
  templateUrl: './user-avatar-uploader.component.html',
  styleUrl: './user-avatar-uploader.component.scss'
})
export class UserAvatarUploaderComponent {
    @Input() image: File | null = null;
    @Output() imageUploadedEvent: EventEmitter<File> = new EventEmitter<File>();

    onFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length) {
            this.imageUploadedEvent.emit(inputElement.files[0]);
        }
    }

    getImageUrl() {
        if (this.image) {
            return URL.createObjectURL(this.image);
        }
        return './assets/images/default-avatar.png';
    }
}
