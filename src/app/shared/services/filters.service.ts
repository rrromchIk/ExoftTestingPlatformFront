import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Filters} from "../../core/interfaces/filters/filters";

@Injectable({
    providedIn: "root"
})
export class FiltersService {
    private filtersSubject: BehaviorSubject<Filters> = new BehaviorSubject<Filters>({
        searchTerm: '',
        sortColumn: '',
        sortOrder: '',
        selectFilters: {},
    });

    public filters$: Observable<Filters> = this.filtersSubject.asObservable();


    updateFilters(filters: Filters) {
        this.filtersSubject.next(filters);
    }

    getCurrentFilters() {
        return this.filtersSubject.getValue();
    }
}
