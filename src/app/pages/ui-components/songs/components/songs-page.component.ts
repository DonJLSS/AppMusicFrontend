import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { MatDialog } from '@angular/material/dialog';
import { EditSongDialogComponent } from './edit-song-dialog.component';
import { SongService } from '../service/song.service';
import { Song } from 'src/app/model/songs/songs.interface';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { routeAnimationsState } from '../../shared/route-animations';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';


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
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s 500ms ease-in', style({ opacity: 1 }))
      ])
    ])
    ,routeAnimationsState],
})
export class SongsPageComponent implements OnInit {

  constructor(private dialog: MatDialog, private songService: SongService) {}


  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;

  sortBy: string = 'title'; // Default sort by title
  sortDirection: string = 'asc'; 

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
    const params = new HttpParams()
      .set('page', this.currentPage.toString()) 
      .set('size', this.pageSize.toString()) 
      .set('title', this.filters.title || '')
      .set('duration', this.filters.duration ? this.filters.duration.toString() : '')
      .set('artistName', this.filters.artistName || '')
      .set('albumName', this.filters.albumName || '')
      .set('sortBy', this.sortBy)
      .set('sortDirection', this.sortDirection);
  
    console.log('Parámetros enviados:', params.toString());
  
    this.songService.getSongs(params).subscribe(
      (response: any) => {
        
        if (response && response.content) {
          this.songs = response.content;
          this.filteredSongs = response.content;
          this.totalItems = response.totalElements;
        } else {
          this.songs = [];
          this.filteredSongs = [];
          this.totalItems = 0;
        }
      },
      (error) => {
        console.error('Error loading songs:', error);
      }
    );
  }
  

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSongs();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadSongs();
  }

  onSortOptionSelect(option: string): void {
    switch (option) {
      case 'Duration':
        this.sortBy = 'duration';
        break;
      case 'Title':
        this.sortBy = 'title';
        break;
      case 'Artist':
        this.sortBy = 'artistName'; 
        break;
      case 'Album':
        this.sortBy = 'albumName'; 
        break;
    }
  
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  
    this.loadSongs(); 
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
