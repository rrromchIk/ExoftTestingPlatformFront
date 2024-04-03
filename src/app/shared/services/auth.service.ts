import {Injectable} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {BehaviorSubject} from "rxjs";
import {TokenModel} from "../../core/interfaces/auth/token.model";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../core/interfaces/user/user.model";

@UntilDestroy()
@Injectable({
    providedIn: "root"
})
export class AuthService {
    setCurrentUser(user: UserModel): void {
        console.log("setting user to localstorage");
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    setTokensPair(tokens: TokenModel): void {
        console.log("setting tokens to localstorage");
        console.log(tokens);
        localStorage.setItem('tokensPair', JSON.stringify(tokens));
    }

    getCurrentUser(): UserModel | null {
        const currentUser = localStorage.getItem('currentUser')
        return currentUser != null ? JSON.parse(currentUser) : null;
    }

    getTokensPair(): TokenModel | null {
        const tokens = localStorage.getItem('tokensPair');
        return tokens != null ? JSON.parse(tokens) : null;
    }
}
