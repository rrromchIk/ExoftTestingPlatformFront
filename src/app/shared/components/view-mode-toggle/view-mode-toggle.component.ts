import {Component} from '@angular/core';
import {ViewModeService} from "../../services/view-mode.service";

@Component({
  selector: 'app-view-mode-toggle',
  templateUrl: './view-mode-toggle.component.html',
  styleUrl: './view-mode-toggle.component.scss'
})
export class ViewModeToggleComponent {
    constructor(private viewModeService: ViewModeService) {
    }

    toggleViewMode(viewMode: string) {
        this.viewModeService.updateViewMode(viewMode);
    }
}
