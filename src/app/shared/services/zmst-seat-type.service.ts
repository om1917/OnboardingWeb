
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEndPoints } from "../constants/apiEndpoints";
import { ZmstSeatTypeModel } from "../model/zmst-seat-type.model";
@Injectable({
    providedIn: "root"
})

export class ZmstSeatTypeService {
    constructor(private http: HttpClient) {

    }

    insert(data: any): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.post<any>(ApiEndPoints.ZmstSeatType_Insert, data, { headers: headers });
    }
    update(data: any): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.post<any>(ApiEndPoints.ZmstSeatType_Update, data, { headers: headers });
    }
    delete(id: any) {
        const headers = { "Accept": "text/plain" }
        return this.http.post<any>(ApiEndPoints.ZmstSeatType_Delete + id, { headers: headers });
    }
    getAll(): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.get<any>(ApiEndPoints.ZmstSeatType_GetAll, { headers: headers });
    }
    getById(id: any): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.get<any>(ApiEndPoints.ZmstSeatType_GetById + id, { headers: headers });
    }
}