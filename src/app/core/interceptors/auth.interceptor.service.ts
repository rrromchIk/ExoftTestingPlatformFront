import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, switchMap, throwError} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {Injectable} from "@angular/core";
import {LoaderService} from "../../shared/services/loader.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private loaderService: LoaderService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.showLoading(true);

        if (req.url.includes('auth/login')) {
            return next.handle(req)
                .pipe(
                    finalize(() => this.loaderService.showLoading(false))
                )
        }

        return this.processRequestWithToken(req, next)
            .pipe(
                finalize(() => this.loaderService.showLoading(false)),
                catchError(error => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        return this.authService.refreshToken()
                            .pipe(
                                switchMap(() => this.processRequestWithToken(req, next)),
                            );
                    }

                    return throwError(() => error);
                })
            );
    }


    private processRequestWithToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getTokensPair();

        console.log("interceptor::appending access token to outgoing request")
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
