import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/model/songs/songs.interface';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = '/api/songs'; //endpoint 

  constructor(private http: HttpClient) {}

  getSongs(params: any): Observable<any> {
    let queryParams = new HttpParams()
      .set('pageIndex', params.pageIndex || '0')
      .set('pageSize', params.pageSize || '5');
  
    if (params.title) {
      queryParams = queryParams.set('title', params.title);
    }
    if (params.duration) {
      queryParams = queryParams.set('duration', params.duration);
    }
    if (params.artistName) {
      queryParams = queryParams.set('artistName', params.artistName);
    }
    if (params.albumName) {
      queryParams = queryParams.set('albumName', params.albumName);
    }
  
    return this.http.get(`${this.apiUrl}/search`, { params: queryParams });
  }
  
  


  addSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.apiUrl, song);
  }

  updateSong(id: number, song: Song): Observable<Song> {
    return this.http.put<Song>(this.apiUrl + '/' + id, song);
  }
  
  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
