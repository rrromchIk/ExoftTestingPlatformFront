import {Component, Input, OnInit} from '@angular/core';
import {UserQuestionModel} from "../../../core/interfaces/user-question/user-question.model";
import {QuestionModel} from "../../../core/interfaces/question/question.model";
import {PassTestService} from "../services/pass-test.service";
import {QuestionApiService} from "../../../core/services/api/question.api.service";
import {UserTestApiService} from "../../../core/services/api/user-test.api.service";
import {UserTestModel} from "../../../core/interfaces/user-test/user-test.model";
import {TestModel} from "../../../core/interfaces/test/test.model";
import {TestApiService} from "../../../core/services/api/test.api.service";

@Component({
    selector: 'app-passing-test',
    templateUrl: './passing-test.component.html',
    styleUrl: './passing-test.component.scss'
})
export class PassingTestComponent implements OnInit {
    userTest: UserTestModel | null = null;
    test!: TestModel;

    userQuestions: UserQuestionModel[] = [];
    currentQuestionIndex: number = 1;
    currentQuestion: QuestionModel | null = null;
    preloadedNextQuestion: QuestionModel | null = null;

    userId: string = "f9884071-88d7-46af-d332-08dc45be50ce";

    constructor(private passTestService: PassTestService,
                private questionService: QuestionApiService,
                private userTestService: UserTestApiService,
                private testService: TestApiService) {
    }

    @Input()
    set id(testId: string) {
        this.userTestService.getUserTest(this.userId, testId)
            .subscribe(response => {
                console.log(response);
                this.userTest = response;
            });
    }

    ngOnInit(): void {
        this.passTestService.getUserQuestionsForNewTest(this.userId, "69567ec1-e01d-4c91-4753-08dc4447a825")
            .subscribe(data => {
                console.log(data);

                this.userQuestions = this.userQuestions.concat(data);
                this.currentQuestionIndex = 0;

                this.setCurrentQuestion();
            });
    }

    setCurrentQuestion() {
        if (this.preloadedNextQuestion) {
            this.currentQuestion = this.preloadedNextQuestion;
        } else {
            this.questionService.getQuestionById(this.userQuestions[this.currentQuestionIndex].questionId).subscribe(
                data => this.currentQuestion = data
            )
        }

        this.preloadNextQuestion();
    }

    preloadNextQuestion() {
        if (this.currentQuestionIndex < this.userQuestions.length - 1) {
            this.questionService.getQuestionById(this.userQuestions[this.currentQuestionIndex + 1].questionId).subscribe(
                data => this.preloadedNextQuestion = data
            )
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

    onNextQuestionButtonClicked() {
        this.userQuestions[this.currentQuestionIndex].isAnswered = true;

        this.currentQuestionIndex++;
        this.setCurrentQuestion();
    }

    onCompleteTestClicked() {
        console.log("complete test")
    }
}
