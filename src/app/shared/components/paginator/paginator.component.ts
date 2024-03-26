import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {PagingSettings} from "../../../core/interfaces/paging-settings";

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
    @Input() length: number = 50;
    @Input() pageSize: number = 10;
    @Input() pageIndex: number = 0;
    @Input() pageSizeOptions: number[] = [1, 3, 5, 10];

    @Input() hidePageSize: boolean = false;
    @Input() showPageSizeOptions: boolean = true;
    @Input() showFirstLastButtons: boolean = true;
    @Input() disabled: boolean = false;


    @Output() pageChangedEvent: EventEmitter<PagingSettings> = new EventEmitter<PagingSettings>();

    handlePageEvent(e: PageEvent) {
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.pageChangedEvent.emit({
            page: this.pageIndex + 1,
            pageSize: this.pageSize
        })
    }
}


