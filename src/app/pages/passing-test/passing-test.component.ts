import {Component, OnInit} from '@angular/core';
import {UserQuestionModel} from "../../core/interfaces/user-question/user-question.model";
import {QuestionModel} from "../../core/interfaces/question/question.model";
import {PassTestService} from "./pass-test.service";
import {QuestionApiService} from "../../core/services/api/question.api.service";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AnswerModel} from "../../core/interfaces/answer/answer.model";
import {UserTestModel} from "../../core/interfaces/user-test/user-test.model";
import {DateTime, Duration} from "luxon";

@UntilDestroy()
@Component({
    selector: 'app-passing-test',
    templateUrl: './passing-test.component.html',
    styleUrl: './passing-test.component.scss',
    providers: [PassTestService]
})
export class PassingTestComponent implements OnInit {
    userId: string;
    userTest: UserTestModel | null = null;

    userQuestions: UserQuestionModel[] = [];
    currentQuestionIndex: number;
    currentQuestion: QuestionModel | null = null;
    preloadedNextQuestion: QuestionModel | null = null;
    selectedAnswers: AnswerModel[] = [];
    remainingTime: number;

    constructor(private passTestService: PassTestService,
                private questionService: QuestionApiService,
                private authService: AuthService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.userId = this.authService.getCurrentUser()!.id;
        const testId = this.route.snapshot.queryParamMap.get('id')!;

        this.passTestService.startTest(this.userId, testId);

        this.passTestService.userQuestions$
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                if (data) {
                    this.userQuestions = data;
                    this.currentQuestionIndex = this.calculateCurrentQuestionIndex();

                    this.preloadedNextQuestion = null;
                    this.setCurrentQuestion();
                }
            });

        this.passTestService.userTest$
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                if (data) {
                    this.userTest = data;
                    this.calculateRemainingTime();
                }
            });
    }

    setCurrentQuestion() {
        if (this.preloadedNextQuestion) {
            this.currentQuestion = this.preloadedNextQuestion;
        } else {
            this.questionService.getQuestionById(this.userQuestions[this.currentQuestionIndex].questionId)
                .pipe(untilDestroyed(this))
                .subscribe(data => this.currentQuestion = data)
        }

        this.preloadNextQuestion();
    }

    preloadNextQuestion() {
        if (this.currentQuestionIndex < this.userQuestions.length - 1) {
            this.questionService.getQuestionById(this.userQuestions[this.currentQuestionIndex + 1].questionId)
                .pipe(untilDestroyed(this))
                .subscribe(data => this.preloadedNextQuestion = data)
        } else {
            this.preloadedNextQuestion = null;
        }
    }

    isMultipleChoice(question: QuestionModel): boolean {
        return question.answers.filter(answer => answer.isCorrect).length > 1;
    }

    isLastQuestion(): boolean {
        return this.currentQuestionIndex == this.userQuestions.length - 1;
    }

    calculateCurrentQuestionIndex() {
        const lastIndexOfAnsweredQuestion = this.userQuestions.map(q => q.isAnswered).lastIndexOf(true);
        return lastIndexOfAnsweredQuestion + 1;
    }

    calculateRemainingTime() {
        const testDuration = Duration.fromObject({minutes: this.userTest?.test.duration});
        const startingTime = DateTime.fromJSDate(new Date(this.userTest!.startingTime));
        const limitTime = startingTime.plus(testDuration);

        this.remainingTime = limitTime.diffNow().milliseconds;
    }

    onNextQuestionButtonClicked() {
        this.passTestService.createUserAnswers(this.userId, this.selectedAnswers);

        this.selectedAnswers = [];
        this.userQuestions[this.currentQuestionIndex].isAnswered = true;

        this.currentQuestionIndex++;
        this.setCurrentQuestion();
    }

    onAnswerClicked(answer: AnswerModel, ) {
        if (this.isMultipleChoice(this.currentQuestion!)) {
            const answerIndex = this.selectedAnswers.indexOf(answer);

            if (answerIndex >= 0) {
                this.selectedAnswers.splice(answerIndex, 1);
            } else {
                this.selectedAnswers.push(answer);
            }
        } else {
            this.selectedAnswers = [answer];
        }
    }

    onCompleteTestClicked() {
        this.passTestService.createUserAnswers(this.userId, this.selectedAnswers);
        this.passTestService.completeUserTest(this.userId, this.userTest!.test.id);
    }
}
