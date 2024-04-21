import {Component, Input} from '@angular/core';
import {TestToPassModel} from "../../../../../core/interfaces/user-test/test-to-pass.model";
import {UserTestStatus} from "../../../../../core/interfaces/user-test/user-test-status.enum";
import {Router} from "@angular/router";
import {ViewModeService} from "../../../../../shared/services/view-mode.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-test-to-pass-item',
  templateUrl: './test-to-pass-item.component.html',
  styleUrl: './test-to-pass-item.component.scss'
})
export class TestToPassItemComponent {
    protected readonly UserTestStatus = UserTestStatus;
    @Input() testToPass: TestToPassModel;

    viewMode$: Observable<string>
    constructor(private router: Router, viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$;
    }

    onPassTest(test: TestToPassModel) {
        this.router.navigate(['pass-test'], {
            queryParams: {id: test.id}
        })
    }

}
