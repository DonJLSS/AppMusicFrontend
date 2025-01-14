export interface Song {
    id:         number;
    title:      string;
    duration:   number;
    songUrl:    string;
    albumName:  null | string;
    artistName: string;
    genreNames: null | string[];
}
/* export interface SongDTO {
    id:         number;
    title:      string;
    duration:   number;
    songUrl:    string;
    albumName:  null | string;
    artistName: string;
    genreNames: string[];
} */
