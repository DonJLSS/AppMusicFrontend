import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatDialog } from '@angular/material/dialog';
import { Album } from 'src/app/model/album/album.interface';
import { AlbumService } from '../../songs/service/album.service';
import routeAnimationsState from '../../shared/route-animations';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { EditAlbumDialogComponent } from './edit-album-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';


@Component({
  selector: 'app-album-page',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    FormsModule,
  ],
  templateUrl: './album-page.component.html',
  styleUrl: './album-page.component.css',
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
export class AlbumPageComponent implements OnInit {

  constructor(private dialog: MatDialog, private albumService: AlbumService) {}

  albums: Album[] = [];
  filteredAlbums: Album[] = [];

  myControl = new FormControl('');
  sortOptions: string[] = ['Title', 'Artist', 'Release Year', 'Tracks Count'];
  filters = {
    title: '',
    artistName: '',
    launchYear: null,
    songsCount: null
  };

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.albumService.getAlbums().subscribe((data: Album[]) => {
      this.albums = data;
      this.filteredAlbums = [...this.albums];
    });
  }

  applyFilters(): void {
    this.filteredAlbums = this.albums.filter(album => {
      return (
        (!this.filters.title ||
          album.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
        (!this.filters.artistName ||
          album.artistName.toLowerCase().includes(this.filters.artistName.toLowerCase())) &&
        (!this.filters.launchYear ||
          this.compareYears(album.launchYear, Number(this.filters.launchYear))) &&
        (!this.filters.songsCount ||
          album.songsCount === Number(this.filters.songsCount))
      );
    });
  }

  private compareYears(albumYear: number, filterYear: number): boolean {
    return albumYear === filterYear;
  }

  onSortOptionSelect(option: string): void {
    this.filteredAlbums.sort((a, b) => {
      switch (option) {
        case 'Title':
          return a.title.localeCompare(b.title);
        case 'Artist':
          return a.artistName.localeCompare(b.artistName);
        case 'Release Year':
          return a.launchYear - b.launchYear;
        case 'Tracks Count':
          return a.songsCount - b.songsCount;
        default:
          return 0;
      }
    });
  }

  onNewAlbumClick(): void {
    const dialogRef = this.dialog.open(EditAlbumDialogComponent, {
      width: '400px',
      data: { id: null, title: '', launchYear: null, description: '', songsCount: 0, artistName: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {

        this.albumService.addAlbum(result).subscribe(
          (newAlbum: Album) => {
            this.albums.push(newAlbum);
            this.applyFilters();
            console.log('New album addded successfully');
          },
          (error: any) => {
            console.error('Error adding new album:', error);
          }
        );
      }
    });
  
  }

  editInformation(album: Album): void {
    const dialogRef = this.dialog.open(EditAlbumDialogComponent, {
      width: '400px',
      data: {...album }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.albumService.updateAlbum(album.id, result).subscribe(
          updatedAlbum => {
            const index = this.albums.findIndex(a => a.id === updatedAlbum.id);
            if (index!== -1) {
              this.albums[index] = updatedAlbum;
              this.applyFilters();
            }
            console.log('Album updated successfully');
          },
          (error: any) => {
            console.error('Error updating album:', error);
          }
        );
      }
    });
    
  }

  deleteInformation(album: Album): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this album?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const index = this.albums.findIndex(a => a.id === album.id);
        if (index !== -1) {
          this.albums.splice(index, 1);
          this.applyFilters();
        }
        this.albumService.deleteAlbum(album.id).subscribe(() => {
          console.log('Album deleted successfully');
        });
      }
    });
  }
}