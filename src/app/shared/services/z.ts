import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEndPoints } from "../constants/apiEndpoints";
import { MdDistrictModel } from "../model/md-district.model";


@Injectable({
    providedIn: "root"
})

export class MdDistrictService {
    constructor(private http: HttpClient) {
    }
    insert(data: MdDistrictModel): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.post<any>(ApiEndPoints.MdDistrict_Insert, data);
    }
    update(data: MdDistrictModel): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.post<any>(ApiEndPoints.MdDistrict_Update, data);
    }
    delete(id: string) {
        const headers = { "Accept": "text/plain" }
        return this.http.post<any>(ApiEndPoints.MdDistrict_Delete + id, { headers: headers });
    }
    getAll(): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.get<any>(ApiEndPoints.MdDistrict_GetAll);
    }
    getById(id: string): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.get<any>(ApiEndPoints.MdDistrict_GetById + id);
    }
    getListByStateId(stateid: string): Observable<any> {
        const headers = { "Accept": "text/plain" }
        return this.http.get<any>(ApiEndPoints.MdDistrict_GetListByStateId + stateid);
    }
}
