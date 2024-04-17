import {BehaviorSubject, Observable} from "rxjs";
import {PagingSettings} from "../../core/interfaces/filters/paging-settings";

export class PagingService {
    private pagingSettingSubject: BehaviorSubject<PagingSettings> = new BehaviorSubject<PagingSettings>({
        page: 1,
        pageSize: 3
    });

    public pagingSetting$: Observable<PagingSettings> = this.pagingSettingSubject.asObservable();

    updatePagingSettings(pagingSettings: PagingSettings) {
        this.pagingSettingSubject.next(pagingSettings);
    }

    getCurrentPagingSettings() {
        return this.pagingSettingSubject.getValue();
    }

    resetPagingSettings(pagingSettings: PagingSettings) {
        this.updatePagingSettings(pagingSettings);
    }
}
