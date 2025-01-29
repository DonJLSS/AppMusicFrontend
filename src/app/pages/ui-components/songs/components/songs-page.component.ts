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
import { Title } from '@angular/platform-browser';
import { routeAnimationsState } from '../../shared/route-animations';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    
      if (this.filters.title) {
        params = params.set('title', this.filters.title);
      }
      if (this.filters.duration) {
        params = params.set('duration', this.filters.duration);
      }
      if (this.filters.artistName) {
        params = params.set('artistName', this.filters.artistName);
      }
      if (this.filters.albumName) {
        params = params.set('albumName', this.filters.albumName);
      }
  
    this.songService.getSongs(params).subscribe(
      (response: any) => {
        this.songs = response.content; 
        this.filteredSongs = [...this.songs]; 
        this.totalItems = response.totalElements; 
        this.currentPage = response.pageable.pageNumber;
      },
      (error) => {
        console.error('Error loading songs:', error);
      }
    );
  }
  

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSongs();
  }

  applyFilters(): void {
    // Filtramos las canciones que ya están en la página actual
    let filtered = this.songs.filter(song => {
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
  
    // Actualizar lista de canciones filtradas y total de elementos
    this.filteredSongs = [...filtered];
    this.totalItems = filtered.length;
  }

  onSortOptionSelect(option: string): void {
    if (!this.filteredSongs || this.filteredSongs.length === 0) return;
  
    this.filteredSongs = [...this.filteredSongs].sort((a, b) => {
      switch (option) {
        case 'Duration':
          return a.duration - b.duration;
        case 'Title':
          return a.title.localeCompare(b.title);
        case 'Artist':
          return a.artistName.localeCompare(b.artistName);
        case 'Album':
          return (a.albumName || '').localeCompare(b.albumName || '');
        default:
          return 0;
      }
    });
  }

  loadSongsWithSorting(sortField: string): void {
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString())
      .set('sort', sortField + ',asc'); 
  
    this.songService.getSongs(params).subscribe(
      (response: any) => {
        this.currentPage = response.number;
        this.songs = response.content;
        this.filteredSongs = [...this.songs];
        this.totalItems = response.totalElements;
      },
      (error) => {
        console.error('Error loading sorted songs:', error);
      }
    );
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
