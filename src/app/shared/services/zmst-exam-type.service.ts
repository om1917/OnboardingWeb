
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEndPoints } from "../constants/apiEndpoints";
@Injectable({
  providedIn: "root"
})
export class ZmstExamTypeService {
  constructor(private http: HttpClient) {
  }
  insert(data: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstExamType_Insert, data, { headers: headers });
  }
  update(data: any): Observable<any> {
    
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstExamType_Update, data, { headers: headers });
  }
  delete(id: any) {
    const headers = { "Accept": "text/plain" }
    return this.http.post<any>(ApiEndPoints.ZmstExamType_Delete + id, { headers: headers });
  }
  getAll(): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.get<any>(ApiEndPoints.ZmstExamType_GetAll, { headers: headers });
  }
  getById(id: any): Observable<any> {
    const headers = { "Accept": "text/plain" }
    return this.http.get<any>(ApiEndPoints.ZmstExamType_GetById + id, { headers: headers });
  }
}