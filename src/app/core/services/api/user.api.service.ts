import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagedListModel} from "../../interfaces/paged-list.model";
import {UserModel} from "../../interfaces/user/user.model";
import {PagingSettings} from "../../interfaces/paging-settings";
import {UpdatedUserDto} from "../../interfaces/user/updated-user.dto";
import {environment} from "../../../../environments/environment";
import {Filters} from "../../interfaces/filters/filters";
import {HttpParamsHelper} from "../../helpers/http-params.helper";

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    private usersEndpoint = `${environment.apiUrl}/api/users`;

    constructor(private http: HttpClient) {
    }

    getAllUsers(pagingSettings: PagingSettings, filters: Filters): Observable<PagedListModel<UserModel>> {
        let queryParams = new HttpParams();
        queryParams = HttpParamsHelper.applyPaging(queryParams, pagingSettings);
        queryParams = HttpParamsHelper.applyFilters(queryParams, filters);

        console.log(queryParams)

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
}
