import {Component, OnInit} from '@angular/core';
import {PagedListModel} from "../../core/interfaces/paged-list.model";
import {PagingSettings} from "../../core/interfaces/paging-settings";
import {TestTemplateModel} from "../../core/interfaces/test-template.model";
import {TestTmplService} from "../../core/services/api/test-tmpl.api.service";
import {SelectFilter} from "../../shared/interfaces/select-filter";
import {SortCriteria} from "../../shared/interfaces/sort-criteria";
import {FiltersDto} from "../../shared/interfaces/filters-dto";
import {
    CREATION_DATE_SORT_CRITERIA,
    DIFFICULTY_FILTER,
    DURATION_SORT_CRITERIA,
    MODIFICATION_DATE_SORT_CRITERIA
} from "../../core/constants";

@Component({
  selector: 'app-test-templates-list',
  templateUrl: './test-templates-list.component.html',
  styleUrl: './test-templates-list.component.scss'
})
export class TestTemplatesListComponent implements OnInit {
    testTemplates: TestTemplateModel[] = [];
    pagedList: PagedListModel<TestTemplateModel> | null = null;
    isFetching: boolean = false;
    pagingSettings: PagingSettings = {
        page: 1,
        pageSize: 3
    }

    selectFilters: SelectFilter[] = Array.of(DIFFICULTY_FILTER);
    sortCriterias: SortCriteria[] = Array.of(DURATION_SORT_CRITERIA, CREATION_DATE_SORT_CRITERIA, MODIFICATION_DATE_SORT_CRITERIA);

    constructor(private testTmplService: TestTmplService) {
    }

    ngOnInit(): void {
        this.loadTestTemplates();
    }

    loadTestTemplates(): void {
        this.isFetching = true;
        this.testTmplService.getAllTestTemplates(this.pagingSettings)
            .subscribe(responseData => {
                console.log(responseData);
                this.pagedList = responseData;
                this.testTemplates = responseData.items;
                this.isFetching = false;
            })
    }

    onDeleteTestTemplate(testTemplateId: string) {
        window.alert("Are u sure u want to delete?")
        this.testTmplService.deleteTestTemplate(testTemplateId)
            .subscribe(response => {
                this.testTemplates = this.testTemplates.filter(test => test.id !== testTemplateId);
                console.log(response);
            }, error => {
                console.log(error)
            })
    }


    onPageChangedEvent(pagingSetting: PagingSettings) {
        this.pagingSettings = pagingSetting;
        this.loadTestTemplates();
    }

    onFilterChange(filtersDto: FiltersDto) {
        console.log('Filter change event:', filtersDto);
    }
}
