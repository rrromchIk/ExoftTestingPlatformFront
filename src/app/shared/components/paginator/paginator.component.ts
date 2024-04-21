import {Component, Input} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {PagingService} from "../../services/paging.service";

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
    @Input() length: number = 50;
    @Input() pageSize: number = 10;
    @Input() pageIndex: number = 0;
    @Input() pageSizeOptions: number[] = [1, 6, 18, 36];

    @Input() hidePageSize: boolean = false;
    @Input() showPageSizeOptions: boolean = true;
    @Input() showFirstLastButtons: boolean = true;
    @Input() disabled: boolean = false;

    constructor(private pagingService: PagingService) {
    }

    handlePageEvent(e: PageEvent) {
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.pagingService.updatePagingSettings({
            page: this.pageIndex + 1,
            pageSize: this.pageSize
        })
    }
}


