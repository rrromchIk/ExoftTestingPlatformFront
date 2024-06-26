import {Component} from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: 'app-user-main',
    templateUrl: './user-main.component.html',
    styleUrl: './user-main.component.scss'
})
export class UserMainComponent {
    navLinks = [
        { path: 'all-tests', label: 'All tests' },
        { path: 'started-tests', label: 'Started tests' },
        { path: 'user-statistic', label: 'Statistic' },
    ];
    activeLink = this.navLinks[0];

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this.router.events
            .pipe(untilDestroyed(this))
            .subscribe((event) => {
                if(event instanceof NavigationEnd)
                    this.setActiveLink()
            });
    }

    onTabChangedEvent(matTabChangeEvent: MatTabChangeEvent) {
        this.activeLink = this.navLinks[matTabChangeEvent.index];
        const linkToNavigate = this.activeLink.path;
        this.router.navigate([linkToNavigate], {relativeTo: this.activatedRoute});
    }

    setActiveLink() {
        const currentPath = this.router.url.split('/')[2];
        const activeRoute = this.navLinks.find(link => link.path === currentPath);
        if (activeRoute)
            this.activeLink = activeRoute;
    }
}
