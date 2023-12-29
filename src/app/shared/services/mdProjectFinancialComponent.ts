import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndPoints } from '../constants/apiEndpoints';
import { ZmstProject } from '../model/zmstProjectModel';
import { TokenExpireService } from '../common/tokenExpireService';

@Injectable({
    providedIn: 'root'
})
export class MdProjectFinancialComponentServices{
    constructor(private http: HttpClient,private tokenExpire: TokenExpireService) {
    }
    GetAll(){  
        localStorage.setItem('isauth', '1');
        return this.http.get<any>(ApiEndPoints.MdProjectFinancialComponentGetAll);
    }
}