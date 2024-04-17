import {Component, Input} from '@angular/core';
import {SortCriteria} from "../../../core/interfaces/filters/sort-criteria";
import {SelectFilter} from "../../../core/interfaces/filters/select-filter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FiltersService} from "../../services/filters.service";
import {PagingService} from "../../services/paging.service";

@UntilDestroy()
@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss'
})
export class FiltersComponent {
    @Input() sortCriterias: SortCriteria[] = [];
    @Input() selectFilters: SelectFilter[] = [];
    filterForm: FormGroup;

    constructor(private fb: FormBuilder,
                private filtersService: FiltersService,
                private pagingService: PagingService) {
    }

    ngOnInit() {
        this.initializeForm();
    }

    initializeForm() {
        const formGroupConfig: { [key: string]: any } = {};

        this.selectFilters.forEach(filter => {
            formGroupConfig[filter.filterName] = [''];
        });

        formGroupConfig['searchTerm'] = [''];
        formGroupConfig['sortColumn'] = [''];
        formGroupConfig['sortOrder'] = [''];

        this.filterForm = this.fb.group(formGroupConfig);

        this.filterForm.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                untilDestroyed(this)
            )
            .subscribe(() => {
                this.emitFilterChangeEvent();
            });
    }

    onSortButtonClick(sortColumn: string) {
        const previousSortColumn = this.filterForm.get('sortColumn')?.value;
        let newSortDirection: string;

        if (sortColumn === previousSortColumn) {
            const currentDirection = this.filterForm.get('sortOrder')?.value;
            switch (currentDirection) {
                case 'asc':
                    newSortDirection = 'desc';
                    break;
                case 'desc':
                    newSortDirection = '';
                    break;
                default:
                    newSortDirection = 'asc'
            }
        } else {
            newSortDirection = 'asc';
        }

        if (newSortDirection === '') {
            this.filterForm.patchValue({
                sortColumn: '',
                sortOrder: newSortDirection
            });
        } else {
            this.filterForm.patchValue({
                sortColumn: sortColumn,
                sortOrder: newSortDirection
            });
        }
    }

    emitFilterChangeEvent() {
        const selectFilters: { [key: string]: string } = {};

        this.selectFilters.forEach(filter => {
            selectFilters[filter.filterName] = this.filterForm.get(filter.filterName)?.value;
        });

        const sortColumn = this.filterForm.get('sortColumn')?.value;
        const sortOrder = this.filterForm.get('sortOrder')?.value;
        const searchTerm = this.filterForm.get('searchTerm')?.value;

        this.pagingService.resetPagingSettings();
        this.filtersService.updateFilters({sortColumn, sortOrder, selectFilters, searchTerm});
    }

    clearSearchInput() {
        this.filterForm.get('searchTerm')?.setValue('');
    }
}
