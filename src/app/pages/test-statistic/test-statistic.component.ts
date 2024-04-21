import {Component} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {StatisticApiService} from "../../core/services/api/statistic.api.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ActivatedRoute} from "@angular/router";
import {TestStatisticModel} from "../../core/interfaces/statistic/test-statistic.model";
import {ALL_TEST_RESULTS_DISTRIBUTION_CHART_COLORS} from "../../core/constants/charts.colors.constants";

@UntilDestroy()
@Component({
    selector: 'app-test-statistic',
    templateUrl: './test-statistic.component.html',
    styleUrl: './test-statistic.component.scss'
})
export class TestStatisticComponent {
    chart: Chart<any>;
    testStatistic: TestStatisticModel | null = null;

    constructor(private statisticApiService: StatisticApiService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        const testId = this.route.snapshot.params['id'];

        this.statisticApiService.getTestStatistic(testId)
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                console.log(data);
                this.testStatistic = data;

                this.createChart();
            });

    }

    createChart() {
        Chart.register(...registerables);

        const counts = [0, 0, 0, 0, 0];
        for (const result of this.testStatistic!.allUsersResults) {
            if (result < 20) {
                counts[0]++;
            } else if (result >= 20 && result < 40) {
                counts[1]++;
            } else if(result >= 40 && result < 60) {
                counts[2]++;
            } else if(result >= 60 && result < 80) {
                counts[3]++;
            } else if(result >= 80 && result <= 100) {
                counts[4]++;
            }
        }

        const data = {
            labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
            datasets: [{
                barPercentage: 0.6,
                label: 'Amount of tests',
                data: counts,
                backgroundColor: ALL_TEST_RESULTS_DISTRIBUTION_CHART_COLORS,
                borderWidth: 1,
            }],
        };

        this.chart = new Chart('canvas', {
            type: 'bar',
            data: data,
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Amount of tests'
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Results groups'
                        },
                    }
                }
            },
        });
    }
}
