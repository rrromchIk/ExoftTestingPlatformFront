import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {TestTemplateModel} from "../../core/interfaces/test-template/test-template.model";
import {SelectFilter} from "../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../core/interfaces/filters/sort-criteria";
import {
    CREATION_DATE_SORT_CRITERIA,
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
    MODIFICATION_DATE_SORT_CRITERIA
} from "../../core/constants/filters.constants";
import {MatDialog} from "@angular/material/dialog";
import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {TestTemplatesPageService} from "./test-templates.page.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {filter, Observable} from "rxjs";
import {FiltersService} from "../../shared/services/filters.service";
import {PagingService} from "../../shared/services/paging.service";
import {UsersPageService} from "../users-list/users.page.service";
import {ViewModeService} from "../../shared/services/view-mode.service";

@UntilDestroy()
@Component({
    selector: 'app-test-templates-list',
    templateUrl: './test-templates-list.component.html',
    styleUrl: './test-templates-list.component.scss',
    providers: [TestTemplatesPageService, FiltersService, PagingService]
})
export class TestTemplatesListComponent implements OnInit {
    testTemplates: TestTemplateModel[] = [];
    pagedList: PagedListModel<TestTemplateModel> | null = null;

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA, MODIFICATION_DATE_SORT_CRITERIA);

    viewMode$: Observable<string>;

    constructor(private testTmplsPageService: TestTemplatesPageService,
                private dialog: MatDialog,
                viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$;
    }

    ngOnInit() {
        this.testTmplsPageService.pagedListOfTestTemplates$
            .pipe(untilDestroyed(this))
            .subscribe(
                response => {
                    this.pagedList = response;
                    this.testTemplates = response?.items || [];
                }
            )
    }

    onDeleteTestTemplate(testTemplateId: string) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete test template?',
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: dialogData
        });

        dialogRef
            .afterClosed()
            .pipe(
                untilDestroyed(this),
                filter((result) => result),
            )
            .subscribe(() => this.testTmplsPageService.deleteTestTemplate(testTemplateId));
    }
}
