import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ViewModeService {
    private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>("list");
    public viewMode$: Observable<string> = this.viewModeSubject.asObservable();


    public updateViewMode(viewMode: string) {
        this.viewModeSubject.next(viewMode);
    }
}
