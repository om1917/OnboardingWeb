import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
//import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { TokenLocalStorageService } from '../tokenLocalStorage/tokenLocalStorageService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private storage: TokenLocalStorageService, private router: Router, private toastrService: ToastrService,) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (localStorage.getItem('isauth') == '0') {

      request = request.clone({
        setHeaders: {

          Accept: "text/plain",
          responseType: "text",
          apikey: "a0sdas08as8sd9hfd8j99894uufj8u89ufj88hjfg"

          //grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
          // Authorization: `Bearer "asdfasdfdsadfasdf"`
        }

      });
      return next.handle(request);
    }

    else if (localStorage.getItem('isauth') == '1') {

      const token =
        localStorage.getItem("token");

      if ((JSON.parse(atob(token.split('.')[1])).exp) < Date.now() / 1000) {
        //this.toastrService.error('Timeout');
        // tokenexp="";
        localStorage.clear();
        //this.router.navigate(['/login']);
        window.location.href = '/login';
      }

      request = request.clone({
        setHeaders: {
          Accept: "text/plain",
          responseType: "text",
          Authorization: `Bearer ${this.storage.get('token')}`,
          RefreshToken: this.storage.get('refreshToken'),
          apikey: "a0sdas08as8sd9hfd8j99894uufj8u89ufj88hjfg"

        }

      });

      return next.handle(request);


    }

    else {
      return next.handle(request);

    }

  }
}