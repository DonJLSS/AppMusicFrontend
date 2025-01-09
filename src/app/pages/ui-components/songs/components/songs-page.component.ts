import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from "../../../../pipes/pipes.module";
import { MatDialog } from '@angular/material/dialog';
import { EditSongDialogComponent } from './edit-song-dialog.component';
import { SongService } from '../service/song.service';

@Component({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    FormsModule,
  ],
  standalone: true,
  selector: 'app-songs-page',
  templateUrl: './songs-page.component.html',
  styleUrl: './songs-page.component.css'
})
export class SongsPageComponent implements OnInit {
  
  constructor(private dialog: MatDialog, private songService: SongService ) {}

  

  songs = [
    { title: 'Psycho Killer', artist: 'Talking Heads', album: 'Talking Heads: 77', duration: 270 },
    { title: 'Once in a Lifetime', artist: 'Talking Heads', album: 'Remain in Light', duration: 240 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Life on Mars?', artist: 'David Bowie', album: 'Hunky Dory', duration: 210 },
    { title: 'Heroes', artist: 'David Bowie', album: 'Heroes', duration: 245 },
    { title: 'Space Oddity', artist: 'David Bowie', album: 'Space Oddity', duration: 300 },
    { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 355 },
    { title: 'Another One Bites the Dust', artist: 'Queen', album: 'The Game', duration: 215 },
    { title: 'Don’t Stop Me Now', artist: 'Queen', album: 'Jazz', duration: 210 },
    { title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', duration: 294 },
    { title: 'Beat It', artist: 'Michael Jackson', album: 'Thriller', duration: 258 },
    { title: 'Thriller', artist: 'Michael Jackson', album: 'Thriller', duration: 357 },
    { title: 'Wonderwall', artist: 'Oasis', album: '(What\'s the Story) Morning Glory?', duration: 258 },
    { title: 'Don’t Look Back in Anger', artist: 'Oasis', album: '(What\'s the Story) Morning Glory?', duration: 290 },
    { title: 'Champagne Supernova', artist: 'Oasis', album: '(What\'s the Story) Morning Glory?', duration: 450 },
    { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration: 301 },
    { title: 'Come As You Are', artist: 'Nirvana', album: 'Nevermind', duration: 219 },
    { title: 'Lithium', artist: 'Nirvana', album: 'Nevermind', duration: 257 },
    { title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', duration: 233 },
    { title: 'Perfect', artist: 'Ed Sheeran', album: 'Divide', duration: 263 },
    { title: 'Castle on the Hill', artist: 'Ed Sheeran', album: 'Divide', duration: 261 },
  ];
  
  filteredSongs = [...this.songs];

  myControl = new FormControl('');
  sortOptions: string[] = ['Title', 'Duration', 'Artist', 'Album'];
  filters = {
    title: '',
    duration: '',
    artist: '',
    album: ''
  };

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.getSongs().subscribe(data => {
      this.songs = data;
      this.filteredSongs = data; 
    });
  }

  applyFilters(): void {
    this.filteredSongs = this.songs.filter(song => {
      return (
        (!this.filters.title ||
          song.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
        (!this.filters.duration ||
          song.duration === Number(this.filters.duration)) &&
        (!this.filters.artist ||
          song.artist.toLowerCase().includes(this.filters.artist.toLowerCase())) &&
        (!this.filters.album ||
          song.album.toLowerCase().includes(this.filters.album.toLowerCase()))
      );
    });
  }

  onSortOptionSelect(option: string): void {
    switch (option) {
      case 'Duration':
        this.filteredSongs = [...this.filteredSongs].sort((a, b) => a.duration - b.duration);
        break;
      case 'Title':
        this.filteredSongs = [...this.filteredSongs].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Artist':
        this.filteredSongs = [...this.filteredSongs].sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'Album':
        this.filteredSongs = [...this.filteredSongs].sort((a, b) => a.album.localeCompare(b.album));
        break;
    }
  }

  onNewSongClick(): void {
    console.log('New Song button clicked!');
  }

  editInformation(song: any): void {
    const dialogRef = this.dialog.open(EditSongDialogComponent, {
      width: '250px',
      data: { ...song }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.songs.findIndex(s => s === song);
        if (index !== -1) {
          this.songs[index] = { ...result };
          this.applyFilters();
        }
      }
    });
  }
}
