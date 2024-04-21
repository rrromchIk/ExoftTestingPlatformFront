import {Component, OnInit} from '@angular/core';
import {TestModel} from "../../core/interfaces/test/test.model";
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {SelectFilter} from "../../core/interfaces/filters/select-filter";
import {SortCriteria} from "../../core/interfaces/filters/sort-criteria";
import {
    CREATION_DATE_SORT_CRITERIA,
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
    FROM_TEMPLATE_FILTER,
    MODIFICATION_DATE_SORT_CRITERIA,
    PUBLISHED_FILTER
} from "../../core/constants/filters.constants";
import {DialogDataDto} from "../../core/interfaces/dialog/dialog-data.dto";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TestsPageService} from "./tests.page.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {filter, Observable} from "rxjs";
import {FiltersService} from "../../shared/services/filters.service";
import {PagingService} from "../../shared/services/paging.service";
import {ViewModeService} from "../../shared/services/view-mode.service";

@UntilDestroy()
@Component({
    selector: 'app-tests-list',
    templateUrl: './tests-list.component.html',
    styleUrls: ['./tests-list.component.scss'],
    providers: [TestsPageService, FiltersService, PagingService]
})
export class TestsListComponent implements OnInit {
    tests: TestModel[] = [];
    pagedList: PagedListModel<TestModel> | null = null;

    templatesFilter: SelectFilter = FROM_TEMPLATE_FILTER;
    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER, PUBLISHED_FILTER, this.templatesFilter);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA, MODIFICATION_DATE_SORT_CRITERIA);

    viewMode$: Observable<string>;

    constructor(private testsPageService: TestsPageService,
                private dialog: MatDialog,
                viewModeService: ViewModeService) {
        this.viewMode$ = viewModeService.viewMode$;
    }

    ngOnInit() {
        this.testsPageService.loadTestTmplsShortInfo()
            .pipe(untilDestroyed(this))
            .subscribe(
                (data) => {
                    data.forEach(t => {
                        this.templatesFilter.options.push({
                            optionLabel: t.name, optionValue: t.id
                        })
                    })
                });

        this.testsPageService.pagedListOfTests$.pipe(untilDestroyed(this)).subscribe(
            response => {
                this.pagedList = response;
                this.tests = response?.items || [];
            }
        )
    }

    onDeleteTest(testId: string) {
        const dialogData: DialogDataDto = {
            title: 'Confirm Action',
            content: 'Are you sure you want to delete test?'
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
            .subscribe(() => this.testsPageService.deleteTest(testId));
    }

    onChangePublishedStatus(test: TestModel) {
        this.testsPageService.updatePublishedStatus(test);
    }
}
