import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'testStatusFormatter'
})
export class UserTestStatusPipe implements PipeTransform {
    transform(value: any, status: string): any {
        if (status === 'Completed') {
            return value;
        } else {
            return 'Not completed';
        }
    }
}
