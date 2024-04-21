import {Component} from '@angular/core';
import {ViewModeService} from "../../services/view-mode.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-view-mode-toggle',
  templateUrl: './view-mode-toggle.component.html',
  styleUrl: './view-mode-toggle.component.scss'
})
export class ViewModeToggleComponent {
    viewMode$: Observable<string>;

    constructor(private viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$
    }

    toggleViewMode(viewMode: string) {
        this.viewModeService.updateViewMode(viewMode);
    }
}
