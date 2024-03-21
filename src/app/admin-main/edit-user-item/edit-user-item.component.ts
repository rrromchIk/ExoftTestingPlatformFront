import {Component, Input} from '@angular/core';
import {UserService} from "../../shared/services/user.service";
import {UserResponseDto} from "../../shared/models/user-response.dto";

@Component({
    selector: 'app-edit-user-item',
    templateUrl: './edit-user-item.component.html',
    styleUrl: './edit-user-item.component.scss'
})
export class EditUserItemComponent {
    // user: UserResponseDto | null = null;
    //
    // constructor(private userService: UserService) {
    // }
    //
    // @Input()
    // set id(userId: string) {
    //     this.userService.getUserById(userId).subscribe(response => {
    //           this.user = response;
    //     });
    // }
}
