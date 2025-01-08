import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://your-backend-api-url/songs'; //endpoint 

  constructor(private http: HttpClient) {}

  getSongs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  searchSongs(params: { [key: string]: any }): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
