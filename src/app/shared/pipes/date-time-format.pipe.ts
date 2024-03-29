import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import {DATE_FORMAT} from "../../core/constants/view.constants";

@Pipe({
    name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
    transform(value: any, format: string = DATE_FORMAT): any {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(value, format);
    }
}
