import {Component} from '@angular/core';
import {TestResultModel} from "../../../core/interfaces/test-result/test-result.model";
import {QuestionResultModel} from "../../../core/interfaces/test-result/question-result.model";

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.scss'
})
export class TestResultComponent {
    testResult: TestResultModel = {
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        testId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        totalScore: 15,
        userScore: 10,
        startingTime: new Date(),
        endingTime: new Date(),
        userTestStatus: 'Completed',
        questionsResults: [
            {
                id: '3',
                questionText: 'What is the capital of Italy?',
                maxScore: 5,
                userScore: 0,
                answersResults: [
                    {
                        id: '7',
                        answerText: 'Rome',
                        isCorrect: true,
                        isUserAnswerSelected: false
                    },
                    {
                        id: '8',
                        answerText: 'Madrid',
                        isCorrect: false,
                        isUserAnswerSelected: true
                    },
                    {
                        id: '9',
                        answerText: 'Athens',
                        isCorrect: false,
                        isUserAnswerSelected: false
                    }
                ]
            },
            {
                id: '1',
                questionText: 'What is the capital of France?',
                maxScore: 5,
                userScore: 3,
                answersResults: [
                    {
                        id: '1',
                        answerText: 'Paris',
                        isCorrect: true,
                        isUserAnswerSelected: true
                    },
                    {
                        id: '2',
                        answerText: 'Berlin',
                        isCorrect: false,
                        isUserAnswerSelected: false
                    },
                    {
                        id: '3',
                        answerText: 'London',
                        isCorrect: true,
                        isUserAnswerSelected: false
                    }
                ]
            },
            {
                id: '2',
                questionText: 'What is the capital of Japan?',
                maxScore: 5,
                userScore: 5,
                answersResults: [
                    {
                        id: '4',
                        answerText: 'Tokyo',
                        isCorrect: true,
                        isUserAnswerSelected: true
                    },
                    {
                        id: '5',
                        answerText: 'Beijing asd asd asd asd asssssssssssssssssssssssssssssssss asd asd asd ssssssssssssssss asd',
                        isCorrect: false,
                        isUserAnswerSelected: false
                    },
                    {
                        id: '6',
                        answerText: 'Seoul',
                        isCorrect: false,
                        isUserAnswerSelected: false
                    }
                ]
            }
        ]
    };

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
        return (this.testResult.userScore / this.testResult.totalScore * 100).toPrecision(3);
    }

    getTimeSpent() {
        const diff: number = this.testResult.endingTime.getTime()
            - this.testResult.startingTime.getTime();

        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff / 1000) % 60);

        return `${minutes} min ${seconds} sec`
    }
}
