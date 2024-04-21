import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserStatisticModel} from "../../interfaces/statistic/user-statistic.model";
import {TestStatisticModel} from "../../interfaces/statistic/test-statistic.model";

@Injectable({
    providedIn: "root"
})
export class StatisticApiService {
    private statisticEndpoint: string = `${environment.apiUrl}/api/statistic`;

    constructor(private http: HttpClient) {}

    getUserStatistic(userId: string) {
        return this.http.get<UserStatisticModel>(this.statisticEndpoint + `/users/${userId}`);
    }

    getTestStatistic(testId: string) {
        return this.http.get<TestStatisticModel>(this.statisticEndpoint + `/tests/${testId}`);
    }

    getUserPercentileRank(userId: string, testId: string) {
        return this.http.get<number>(this.statisticEndpoint + `/users/${userId}/tests/${testId}/percentile-rank`);
    }
}
