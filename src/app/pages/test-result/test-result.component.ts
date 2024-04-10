import {Component, OnInit} from '@angular/core';
import {TestResultModel} from "../../core/interfaces/test-result/test-result.model";
import {QuestionResultModel} from "../../core/interfaces/test-result/question-result.model";
import {UserTestApiService} from "../../core/services/api/user-test.api.service";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {DateTime, Interval} from "luxon";


@UntilDestroy()
@Component({
    selector: 'app-test-result',
    templateUrl: './test-result.component.html',
    styleUrl: './test-result.component.scss'
})
export class TestResultComponent implements OnInit {
    testResult: TestResultModel | null = null;

    constructor(private userTestApiService: UserTestApiService,
                private authService: AuthService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const testId = this.route.snapshot.queryParamMap.get('id')!;
        this.userTestApiService.getUserTestResult(this.authService.getCurrentUser()!.id, testId)
            .pipe(untilDestroyed(this))
            .subscribe({
                next: (data) => {
                    this.testResult = data;
                }
            })
    }

    getQuestionCorrectAnswers(question: QuestionResultModel): string {
        return question.answersResults
            .filter(a => a.isCorrect)
            .map(a => a.answerText)
            .join('; ');
    }

    isMultipleChoice(question: QuestionResultModel): boolean {
        return question.answersResults.filter(answer => answer.isCorrect).length > 1;
    }

    isQuestionCorrectAnswered(questionResult: QuestionResultModel) {
        return questionResult.userScore === questionResult.maxScore
    }

    isQuestionWrongAnswered(questionResult: QuestionResultModel) {
        return questionResult.userScore === 0
    }

    isQuestionPartiallyCorrectAnswered(questionResult: QuestionResultModel) {
        return questionResult.userScore > 0 && questionResult.userScore < questionResult.maxScore;
    }

    getScoreInPercents() {
        return (this.testResult!.userScore / this.testResult!.totalScore * 100).toPrecision(3);
    }

    getTimeSpent() {
        let start = DateTime.fromJSDate(
            new Date(this.testResult!.startingTime)
        ).startOf("second");

        let end = DateTime.fromJSDate(
            new Date(this.testResult!.endingTime)
        ).startOf("second");


        let duration = Interval.fromDateTimes(start, end).toDuration(['hours', 'minutes', 'seconds']);
        const hours = duration.hours;
        const minutes = duration.minutes;
        const seconds = duration.seconds;

        let resultString = "";
        if (hours > 0) {
            resultString += `${hours} h `
        }
        if (minutes > 0) {
            resultString += `${minutes} min `;
        }
        if (seconds > 0) {
            resultString += `${seconds} sec`
        }

        return resultString
    }
}
