import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagedListModel} from "../../interfaces/paged-list.model";
import {UserModel} from "../../interfaces/user.model";
import {PagingSettings} from "../../interfaces/paging-settings";
import {UpdatedUserDto} from "../../interfaces/updated-user.dto";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersEndpoint = `${environment.apiUrl}/api/users`;

    //private filters = "?page=1&pageSize=9&sortColumn=name&sortOrder=asc"

    constructor(private http: HttpClient) {
    }

    getAllUsers(pagingSettings: PagingSettings): Observable<PagedListModel<UserModel>> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pagingSettings.page);
        queryParams = queryParams.append("pageSize", pagingSettings.pageSize);

        return this.http.get<PagedListModel<UserModel>>(
            this.usersEndpoint,
            {
                params: queryParams
            }
        );
    }

    deleteUser(userId: string) {
        return this.http.delete(this.usersEndpoint + `/${userId}`)
    }

    getUserById(userId: string) {
        return this.http.get<UserModel>(
            this.usersEndpoint + `/${userId}`
        );
    }

    update(userId: string, updatedUser: UpdatedUserDto) {
        return this.http.put(
            this.usersEndpoint + `/${userId}`,
            updatedUser,
            { observe: 'response' }
        )
    }

    updateAvatar(userId: string, file: File) {
        const formData = new FormData();
        formData.append('profilePicture', file);

        return this.http.patch(
            this.usersEndpoint + `/${userId}/avatar`,
            formData,
            { observe: 'response' })
    }

    // getUserAvatar(userId: string) {
    //     return this.http.get<Blob>(
    //         this.usersEndpoint + `/${userId}/avatar/download`,
    //         { responseType: 'blob' }
    //     );
    // }
}
