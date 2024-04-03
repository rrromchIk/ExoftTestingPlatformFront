import {Component, OnInit} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit {
    showLoader: boolean = false;

    constructor(private loaderService: LoaderService) {
    }

    ngOnInit(): void {
        this.loaderService.showLoading$
            .pipe(untilDestroyed(this))
            .subscribe(
                data => this.showLoader = data
            )
    }
}
