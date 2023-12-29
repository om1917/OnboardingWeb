
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEndPoints } from "../constants/apiEndpoints";
@Injectable({
  providedIn: "root"
})
export class ZmstGenderService {
  constructor(private http: HttpClient) {
  }
  insert(data: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstGender_Insert, data, { headers: headers });
  }
  update(data: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstGender_Update, data, { headers: headers });
  }
  delete(genderid: any) {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstGender_Delete + genderid, { headers: headers });
  }
  getAll(): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.get<any>(ApiEndPoints.ZmstGender_GetAll, { headers: headers });
  }
  getById(genderid: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.get<any>(ApiEndPoints.ZmstGender_GetById + genderid, { headers: headers });
  }
}