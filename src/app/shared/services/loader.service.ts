import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private showLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public showLoading$: Observable<boolean> = this.showLoadingSubject.asObservable();

    showLoading(condition: boolean) {
        this.showLoadingSubject.next(condition);
    }
}
