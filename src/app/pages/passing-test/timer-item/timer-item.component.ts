import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {interval, Subscription} from "rxjs";
import {UntilDestroy} from "@ngneat/until-destroy";
import {DateTime, Duration} from "luxon";

@UntilDestroy({checkProperties: true})
@Component({
    selector: 'timer-item',
    templateUrl: './timer-item.component.html',
    styleUrl: './timer-item.component.scss'
})
export class TimerItemComponent implements OnInit {
    @Input() millis: number = 0;
    @Output() timeOut: EventEmitter<void> = new EventEmitter<void>();

    timerSubscription: Subscription | undefined;
    timeRemaining: string;

    ngOnInit() {
        if (this.millis <= 0) {
            this.timeOut.emit();
        }
        this.startTimer();
    }

    startTimer() {
        const deadline = DateTime.now().plus(Duration.fromMillis(this.millis));
        this.countdownTimer(deadline);

        this.timerSubscription = interval(1000)
            .subscribe(count => {
                this.countdownTimer(deadline);
            });
    }

    countdownTimer(deadline: DateTime) {
        this.millis -= 1000;

        if(DateTime.now() >= deadline) {
            this.timerSubscription?.unsubscribe();
            this.timeOut.emit();
            return;
        }

        const remaining = deadline.diff(DateTime.now());
        this.timeRemaining = remaining.toFormat("hh:mm:ss");
    }

    lessThanMinuteTimeRemaining() {
        return Duration.fromMillis(this.millis) < Duration.fromObject({minutes: 1});
    }
}
