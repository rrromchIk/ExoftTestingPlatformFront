import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('auth/login')) {
            return next.handle(req);
        }

        return this.processRequestWithToken(req, next)
            .pipe(
                catchError(error => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        return this.authService.refreshToken()
                            .pipe(
                                switchMap(() => this.processRequestWithToken(req, next)),
                                catchError(error => {
                                    this.authService.logout();

                                    return throwError(error);
                                })
                            );
                    }

                    return throwError(() => new Error(error));
                }));
    }


    private processRequestWithToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getTokensPair();

        console.log("appending token")
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
