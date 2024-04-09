import {Component, OnInit} from '@angular/core';
import {TestResultModel} from "../../core/interfaces/test-result/test-result.model";
import {QuestionResultModel} from "../../core/interfaces/test-result/question-result.model";
import {UserTestApiService} from "../../core/services/api/user-test.api.service";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

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
        const diff: number = new Date(this.testResult!.endingTime).getTime()
            - new Date(this.testResult!.startingTime).getTime();

        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff / 1000) % 60);

        return `${minutes} min ${seconds} sec`
    }
}
