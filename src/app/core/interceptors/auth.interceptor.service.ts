import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.processRequestWithToken(req, next);
            // .pipe(
            //     catchError(error => {
            //         if (error instanceof HttpErrorResponse && error.status === 401) {
            //             return this.authService.refreshToken()
            //                 .pipe(
            //                     switchMap(() => this.processRequestWithToken(request, next)),
            //                     catchError(error => {
            //                         this.authService.logout();
            //
            //                         return throwError(error);
            //                     })
            //                 );
            //         }
            //
            //         return throwError(error);
            //     }));
    }


    private processRequestWithToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getTokensPair();

        console.log(token);
        if (token != null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
        }

        return next.handle(request);
    }
}
