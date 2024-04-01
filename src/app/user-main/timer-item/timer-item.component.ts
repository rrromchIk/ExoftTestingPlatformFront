import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'timer-item',
  templateUrl: './timer-item.component.html',
  styleUrl: './timer-item.component.scss'
})
export class TimerItemComponent implements OnInit, OnDestroy {
    @Input() millis: number = 0;
    @Output() timeOut: EventEmitter<void> = new EventEmitter<void>();

    timerHours: string = '00';
    timerMinutes: string = '00';
    timerSeconds: string = '00';
    timerId: any;

    ngOnInit() {
        if (this.millis <= 0) {
            this.timeOut.emit();
        }
        this.startTimer();
    }

    ngOnDestroy() {
        clearInterval(this.timerId);
    }

    startTimer() {
        const deadline = new Date().valueOf() + this.millis;
        this.countdownTimer(deadline - 1000); //adjust one second delay

        this.timerId = setInterval(() => {
            this.countdownTimer(deadline);
        }, 1000);
    }

    countdownTimer(deadline: number) {
        this.millis -= 1000;
        const diff = deadline - new Date().valueOf();

        const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const seconds = Math.floor(diff / 1000) % 60;

        if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(this.timerId);
            this.timeOut.emit();
        }

        this.timerHours = hours < 10 ? '0' + hours : hours.toString();
        this.timerMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
        this.timerSeconds = seconds < 10 ? '0' + seconds : seconds.toString();
    }

    lessThanMinuteTimeRemaining() {
        return this.millis < 60000;
    }
}
