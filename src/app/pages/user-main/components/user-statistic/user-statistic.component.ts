import {Component, OnInit} from '@angular/core';
import {StatisticApiService} from "../../../../core/services/api/statistic.api.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Chart, registerables} from "chart.js";
import {UserStatisticModel} from "../../../../core/interfaces/statistic/user-statistic.model";


@UntilDestroy()
@Component({
    selector: 'app-user-statistic',
    templateUrl: './user-statistic.component.html',
    styleUrl: './user-statistic.component.scss'
})
export class UserStatisticComponent implements OnInit {
    chart: Chart<any>;
    userStatistic: UserStatisticModel | null = null;

    constructor(private statisticApiService: StatisticApiService,
                private authService: AuthService) {
    }

    ngOnInit() {
        const userId = this.authService.getCurrentUser().id;

        this.statisticApiService.getUserStatistic(userId)
            .pipe(untilDestroyed(this))
            .subscribe(data => {
                this.userStatistic = data;

                this.createChart();
            });

    }

    createChart() {
        Chart.register(...registerables);
        Chart.overrides.doughnut.cutout = '50%'


        const counts = [0, 0, 0];
        for (const score of this.userStatistic!.allTestsResults) {
            if (score < 50) {
                counts[0]++;
            } else if (score >= 50 && score < 100) {
                counts[1]++;
            } else {
                counts[2]++;
            }
        }

        this.chart = new Chart('canvas', {
            type: 'doughnut',
            data: {
                labels: ['< 50%', '> 50%', '100%'],
                datasets: [{
                    label: 'Amount of tests',
                    data: counts,
                    backgroundColor: [
                        '#4CAF50',
                        '#FFA500',
                        '#3F51B5'
                    ],
                    hoverOffset: 4,
                }]
            },
            options: {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'center',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rect'
                        },
                    }
                }
            }
        });
    }
}
