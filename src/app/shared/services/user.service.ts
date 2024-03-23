import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagedListModel} from "../models/paged-list.model";
import {UserModel} from "../models/user.model";
import {PagingSettings} from "../models/paging-settings";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersEndpoint = 'https://localhost:7237/api/users';

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
}
