import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { ApiEndPoints } from '../constants/apiEndpoints';
import { TokenExpireService } from '../common/tokenExpireService';


@Injectable({

    providedIn: 'root'

})

export class AgencyServices {
    constructor(private http: HttpClient,private tokenExpire: TokenExpireService) {

    }
    getAll():Observable<any>{
        
        
        localStorage.setItem('isauth', '1');
        return this.http.get<any>(ApiEndPoints.GetAllAgency);
      }
}