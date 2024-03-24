import {Component} from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-user-main',
    templateUrl: './user-main.component.html',
    styleUrl: './user-main.component.scss'
})
export class UserMainComponent {
    navLinks = [
        { path: 'all-tests', label: 'All tests' },
        { path: 'started-tests', label: 'Started tests' },
    ];
    activeLink = this.navLinks[0];

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    onTabChangedEvent(matTabChangeEvent: MatTabChangeEvent) {
        // @ts-ignore
        this.activeLink = this.navLinks.at(matTabChangeEvent.index)
        const linkToNavigate = this.activeLink?.path;

        this.router.navigate([linkToNavigate], {relativeTo: this.activatedRoute});
    }
}
