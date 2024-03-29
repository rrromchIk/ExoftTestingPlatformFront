import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SortCriteria} from "../../interfaces/sort-criteria";
import {SelectFilter} from "../../interfaces/select-filter";
import {Filters} from "../../interfaces/filters";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
    @Input() sortCriterias: SortCriteria[] = [];
    @Input() selectFilters: SelectFilter[] = [];
    @Output() filterChange: EventEmitter<Filters> = new EventEmitter<Filters>();
    filterForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

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
        formGroupConfig['sortDirection'] = ['none'];

        this.filterForm = this.fb.group(formGroupConfig);
    }

    onSortButtonClick(sortColumn: string) {
        const previousSortColumn = this.filterForm.get('sortColumn')?.value;
        let newSortDirection: string;

        if(sortColumn === previousSortColumn) {
            const currentDirection = this.filterForm.get('sortDirection')?.value;
            switch (currentDirection) {
                case 'asc':
                    newSortDirection = 'desc';
                    break;
                case 'desc':
                    newSortDirection = 'none';
                    break;
                default:
                    newSortDirection = 'asc'
            }
        } else {
            newSortDirection = 'asc';
        }

        if(newSortDirection === 'none') {
            this.filterForm.patchValue({
                sortColumn: '',
                sortDirection: newSortDirection
            });
        } else {
            this.filterForm.patchValue({
                sortColumn: sortColumn,
                sortDirection: newSortDirection
            });
        }

        this.emitFilterChangeEvent();
    }

    emitFilterChangeEvent() {
        const selectFilters: { [key: string]: string } = {};

        this.selectFilters.forEach(filter => {
            selectFilters[filter.filterName] = this.filterForm.get(filter.filterName)?.value;
        });

        const sortColumn = this.filterForm.get('sortColumn')?.value;
        const sortDirection = this.filterForm.get('sortDirection')?.value;
        const searchTerm = this.filterForm.get('searchTerm')?.value;

        this.filterChange.emit({ sortColumn, sortDirection, selectFilters, searchTerm });
    }

    clearSearchInput() {
        this.filterForm.get('searchTerm')?.setValue('');
        this.emitFilterChangeEvent();
    }
}
