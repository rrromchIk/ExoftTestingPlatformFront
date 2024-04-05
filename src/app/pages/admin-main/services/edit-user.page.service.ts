import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {AlertService} from "../../../shared/services/alert.service";
import {BehaviorSubject, Observable} from "rxjs";
import {UserModel} from "../../../core/interfaces/user/user.model";
import {UserApiService} from "../../../core/services/api/user.api.service";
import {UpdatedUserDto} from "../../../core/interfaces/user/updated-user.dto";

@UntilDestroy()
@Injectable()
export class EditUserPageService {
    private userSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);
    public user$: Observable<UserModel  | null> = this.userSubject.asObservable();

    constructor(private userApiService: UserApiService,
                private alertService: AlertService) {
    }


    getUserById(userId: string) {
        this.userApiService.getUserById(userId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: response => {
                    this.userSubject.next(response);
                },
                error: () => {
                    this.alertService.error("Error while getting user");
                }
            })
    }

    updateUser(userId: string, userToUpdate: UpdatedUserDto) {
        this.userApiService.update(userId, userToUpdate)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("User updated successfully");

                    const currentUser = this.userSubject.getValue();
                    if(currentUser) {
                        currentUser.firstName = userToUpdate.firstName;
                        currentUser.lastName = userToUpdate.lastName;
                        this.userSubject.next(currentUser);
                    }
                },
                error: () => {
                    this.alertService.error("Unable to update user");
                    this.userSubject.next(this.userSubject.getValue());
                }
            }
        )
    }

    updateUserAvatar(userId: string, avatarUploaded: File) {
        this.userApiService.updateAvatar(userId, avatarUploaded)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: () => {
                    this.alertService.success("User avatar updated successfully");
                },
                error: () => {
                    this.alertService.success("Unable to updated avatar");
                }
            }
        )
    }
}
