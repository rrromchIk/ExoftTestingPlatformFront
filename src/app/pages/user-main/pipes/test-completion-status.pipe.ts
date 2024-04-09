import {Pipe, PipeTransform} from "@angular/core";
import {UserTestStatus} from "../../../core/interfaces/user-test/user-test-status.enum";

@Pipe({
    name: 'testCompletionFormatter'
})
export class TestCompletionPipe implements PipeTransform {
    transform(value: any, status: string) {
        if (status === UserTestStatus.Completed) {
            return value;
        } else {
            return 'Not completed';
        }
    }
}
