import {Pipe, PipeTransform} from "@angular/core";
import {UserTestStatus} from "../../../core/interfaces/user-test/user-test-status.enum";

@Pipe({
    name: 'testStatusFormatter'
})
export class UserTestStatusPipe implements PipeTransform {
    transform(value: any, status: string): any {
        if (status === UserTestStatus.Completed) {
            return value;
        } else {
            return 'Not completed';
        }
    }
}
