import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedRequest = req.clone(
            {
                headers: req.headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pa2l0aW5yb21hMjYwNUBnbWFpbC5jb20iLCJuYW1laWQiOiIwYTViZmI1OC1kODhhLTRjNDctOTI1My0zZTY1YTZhOTZmYTYiLCJmaXJzdE5hbWUiOiJSb21hbiIsImxhc3ROYW1lIjoiTmlraXRpbiIsInJvbGUiOiJTdXBlckFkbWluIiwibmJmIjoxNzExMzk3MDA1LCJleHAiOjE3MTI1OTM0MDUsImlhdCI6MTcxMTM5NzAwNSwiaXNzIjoiVGVzdGluZ1NlY3VyaXR5IiwiYXVkIjoiVGVzdGluZ0FwaSJ9.bhL1WVtkvDK_hbR7G36WbUWrZhIVz7YqP8jxZ_dn_dE')
            }
        )
        return next.handle(modifiedRequest);
    }
}
