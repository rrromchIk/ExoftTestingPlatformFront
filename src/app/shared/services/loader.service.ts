import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private showLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public showLoading$ = this.showLoadingSubject.asObservable();

    showLoading(condition: boolean) {
        this.showLoadingSubject.next(condition);
    }
}
