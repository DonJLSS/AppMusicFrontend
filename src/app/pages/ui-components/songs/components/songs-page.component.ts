import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { MatDialog } from '@angular/material/dialog';
import { EditSongDialogComponent } from './edit-song-dialog.component';
import { SongService } from '../service/song.service';
import { Song } from 'src/app/model/songs/songs.interface';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Title } from '@angular/platform-browser';

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
  styleUrl: './songs-page.component.css',
})
export class SongsPageComponent implements OnInit {
  constructor(private dialog: MatDialog, private songService: SongService) {}

  songs: Song[] = [];
  filteredSongs: Song[] = [];

  myControl = new FormControl('');
  sortOptions: string[] = ['Title', 'Duration', 'Artist', 'Album'];
  filters = {
    title: '',
    duration: '',
    artistName: '',
    albumName: '',
  };

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.getSongs().subscribe((data: Song[]) => {
      this.songs = data;
      this.filteredSongs = [...this.songs];
    });
  }

  applyFilters(): void {
    this.filteredSongs = this.songs.filter(song => {
      return (
        (!this.filters.title ||
          song.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
        (!this.filters.duration ||
          song.duration === Number(this.filters.duration)) &&
        (!this.filters.artistName ||
          song.artistName.toLowerCase().includes(this.filters.artistName.toLowerCase())) &&
        (!this.filters.albumName ||
          (song.albumName && song.albumName.toLowerCase().includes(this.filters.albumName.toLowerCase())))
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
        this.filteredSongs = [...this.filteredSongs].sort((a, b) => a.artistName.localeCompare(b.artistName));
        break;
      case 'Album':
        this.filteredSongs = [...this.filteredSongs].sort((a, b) =>
          (a.albumName || '').localeCompare(b.albumName || '')
        );
        break;
    }
  }

  onNewSongClick(): void {
    const dialogRef = this.dialog.open(EditSongDialogComponent,  {
      width: '400px',
      data:{title: '', artistName: '', albumName:'', songUrl:'', duration: null}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.songService.addSong(result).subscribe(
          (          newSong: Song) => {
            this.songs.push(newSong);
            this.applyFilters();
            console.log('New song added successfully');
          },
          (          error: any) => {
            console.error('Error adding new song:', error);
          }
        );
      }
    });

  }


  editInformation(song: Song): void {
    const dialogRef = this.dialog.open(EditSongDialogComponent, {
      width: '400px',
      data: { ...song }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.songService.updateSong(song.id,result).subscribe(
          updatedSong => {
            const index = this.songs.findIndex(s => s.id === updatedSong.id);
            if (index !== -1) {
              this.songs[index] = updatedSong;
              this.applyFilters();
            }
            console.log('Song updated successfully');
          },
          error => {
            console.error('Error updating song:', error);
          }
        );
      }
    });
  }
  
  

  deleteInformation(song: Song): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { 
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this song?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const index = this.songs.findIndex(s => s.id === song.id);
        if (index !== -1) {
          this.songs.splice(index, 1);
          this.applyFilters();
        }
        this.songService.deleteSong(song.id).subscribe(() => {
          console.log('Song deleted successfully');
        });
      }
    });
  }
}
