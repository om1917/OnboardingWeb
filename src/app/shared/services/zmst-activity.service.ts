
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEndPoints } from "../constants/apiEndpoints";

@Injectable({
  providedIn: "root"
})

export class ZmstActivityService {
  constructor(private http: HttpClient) {
  }

  insert(data: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstActivity_Insert, data, { headers: headers });
  }
  update(data: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstActivity_Update, data, { headers: headers });
  }
  delete(activityid: any) {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstActivity_Delete + activityid, { headers: headers });
  }
  getAll(): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.get<any>(ApiEndPoints.ZmstActivity_GetAll, { headers: headers });
  }
  getById(activityid: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.get<any>(ApiEndPoints.ZmstActivity_GetById + activityid, { headers: headers });
  }
}