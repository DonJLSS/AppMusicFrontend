import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from'src/app/model/artists/artist.interface';
@Injectable({providedIn: 'root'})
export class ArtistService {
    private apiUrl = '/api/artists'; // endpoint

    constructor(private http: HttpClient) {}

    getArtists(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    addArtist(artist: Artist): Observable<Artist> {
        return this.http.post<Artist>(this.apiUrl, artist);
    }

    deleteArtist(id: number): Observable<any> {
        return this.http.delete<any>(this.apiUrl + '/' + id);
    }

    updateArtist(id: number, artist: Artist): Observable<Artist> {
        return this.http.put<Artist>(this.apiUrl + '/' + id, artist);
    }



}
