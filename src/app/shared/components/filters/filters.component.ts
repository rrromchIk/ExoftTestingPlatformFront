import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SortCriteria} from "../../interfaces/sort-criteria";
import {SelectFilter} from "../../interfaces/select-filter";
import {FiltersDto} from "../../interfaces/filters-dto";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
    @Input() sortCriterias: SortCriteria[] = [];
    @Input() selectFilters: SelectFilter[] = [];

    @Output() filterChange: EventEmitter<FiltersDto> = new EventEmitter<FiltersDto>();

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

        this.filterForm = this.fb.group(formGroupConfig);
    }

    onSortButtonClick(sortColumn: string) {
        this.filterForm.get('sortColumn')?.setValue(sortColumn);
        this.emitFilterChangeEvent();
        this.filterForm.get('sortColumn')?.setValue('');
    }

    emitFilterChangeEvent() {
        const selectFilters: { [key: string]: string } = {};

        this.selectFilters.forEach(filter => {
            selectFilters[filter.filterName] = this.filterForm.get(filter.filterName)?.value;
        });

        const sortColumn = this.filterForm.get('sortColumn')?.value;
        const searchTerm = this.filterForm.get('searchTerm')?.value;

       // this.filterChange.emit({ sortColumn, selectFilters });

        console.log({ sortColumn, selectFilters, searchTerm })
    }

    clearSearchInput() {
        this.filterForm.get('searchTerm')?.setValue('');
        this.emitFilterChangeEvent();
    }
}
