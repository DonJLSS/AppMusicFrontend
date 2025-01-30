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

  getSongs(params: HttpParams): Observable<any> {
    const defaultParams = new HttpParams()
      .set('page', '0')
      .set('size', '5')
      .set('sortBy', 'title')
      .set('sortDirection', 'asc');
  
    const queryParams = defaultParams
      .set('page', params.get('page') || '0')
      .set('size', params.get('size') || '5')
      .set('sortBy', params.get('sortBy') || 'title')
      .set('sortDirection', params.get('sortDirection') || 'asc')
      .set('title', params.get('title') || '')
      .set('duration', params.get('duration') || '')
      .set('artistName', params.get('artistName') || '')
      .set('albumName', params.get('albumName') || '');
  
    console.log('Parámetros enviados:', queryParams.toString());
  
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
