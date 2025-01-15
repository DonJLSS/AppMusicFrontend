import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/model/songs/songs.interface';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = '/api/songs'; //endpoint 

  constructor(private http: HttpClient) {}

  getSongs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  searchSongs(params: { [key: string]: any }): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params });
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
