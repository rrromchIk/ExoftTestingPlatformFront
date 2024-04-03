import {Pipe, PipeTransform} from "@angular/core";
import {UserTestStatus} from "../../core/interfaces/user-test/user-test-status.enum";

@Pipe({
    name: 'userTestStatusFormatter'
})
export class UserTestStatusPipe implements PipeTransform {
    transform(value: any): any {
        if (value === UserTestStatus.Completed) {
            return 'Completed';
        } else if(value === UserTestStatus.InProcess) {
            return 'In process'
        } else {
            return 'Not started';
        }
    }
}
