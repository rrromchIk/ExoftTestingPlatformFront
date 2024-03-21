import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedRequest = req.clone(
            {
                headers: req.headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pa2l0aW5yb21hMjYwNUBnbWFpbC5jb20iLCJuYW1laWQiOiIwYTViZmI1OC1kODhhLTRjNDctOTI1My0zZTY1YTZhOTZmYTYiLCJmaXJzdE5hbWUiOiJSb21hbiIsImxhc3ROYW1lIjoiTmlraXRpbiIsInJvbGUiOiJTdXBlckFkbWluIiwibmJmIjoxNzExMDEyNjA5LCJleHAiOjE3MTEwMTk4MDksImlhdCI6MTcxMTAxMjYwOSwiaXNzIjoiVGVzdGluZ1NlY3VyaXR5IiwiYXVkIjoiVGVzdGluZ0FwaSJ9.Q3ORdfYrDeT-odtVMEBPzXKmOwBGaSXuWxkJB1B3nhU')
            }
        )
        return next.handle(modifiedRequest);
    }
}
