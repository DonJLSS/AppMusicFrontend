import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ArtistService } from '../songs/service/artist.service';
import { Artist } from 'src/app/model/artists/artist.interface';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatDialog } from '@angular/material/dialog';
import { EditArtistDialogComponent } from './edit-artist-dialog.component';

@Component({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    FormsModule,
  ],
    selector: 'app-artist-page',
    templateUrl: 'artist-page.component.html',
    styleUrl:'artist-page.component.css',
    standalone: true,
})

export class ArtistPageComponent implements OnInit {
  constructor(private dialog: MatDialog, private artistService: ArtistService) {}

  artists: Artist[] = [];
  filteredArtists: Artist[] = [];

  myControl = new FormControl('');
  sortOptions: string[] = ['Name', 'Nationality', 'DateOfBirth', 'AlbumsCount'];
  filters = {
    name: '',
    nationality: '',
    dateOfBirth: '',
    albumsCount: '',
  };

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getArtists().subscribe((data: Artist[]) => {
      this.artists = data;
      this.filteredArtists = [...this.artists];
    });
  }

  applyFilters(): void {
    this.filteredArtists = this.artists.filter(artist => {
      const dateOfBirthMatch = !this.filters.dateOfBirth || 
        (artist.dateOfBirth && this.compareDates(artist.dateOfBirth, this.filters.dateOfBirth));
      
      return (
        (!this.filters.name ||
          artist.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.nationality ||
          artist.nationality.toLowerCase().includes(this.filters.nationality.toLowerCase())) &&
        dateOfBirthMatch &&
        (!this.filters.albumsCount ||
          artist.albumsCount === parseInt(this.filters.albumsCount, 10))
      );
    });
  }
  
  private compareDates(artistDate: Date, filterDate: string): boolean {
    const artist = new Date(artistDate);
    const filter = new Date(filterDate);
    return artist.getFullYear() === filter.getFullYear() &&
           artist.getMonth() === filter.getMonth() &&
           artist.getDate() === filter.getDate();
  }

  onSortOptionSelect(option: string): void {
    switch (option) {
      case 'Name':
        this.filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Nationality':
        this.filteredArtists.sort((a, b) => a.nationality.localeCompare(b.nationality));
        break;
      case 'DateOfBirth':
        this.filteredArtists.sort((a, b) => {
          if (a.dateOfBirth && b.dateOfBirth) {
            return new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
          }
          return 0;
        });
        break;
      case 'AlbumsCount':
        this.filteredArtists.sort((a, b) => a.albumsCount - b.albumsCount);
        break;
    }
  }
  onNewArtistClick(): void {
    const dialogRef = this.dialog.open(EditArtistDialogComponent, {
      width: '400px',
      data: { name: '', nationality: '', dateOfBirth: null, albumsCount: 0 }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.artistService.addArtist(result).subscribe(
          (newArtist: Artist) => {
            this.artists.push(newArtist);
            this.applyFilters();
            console.log('New artist added successfully');
          },
          (error: any) => {
            console.error('Error adding new artist:', error);
          }
        );
      }
    });
  }
  
    editInformation(artist: Artist){
      console.log('boton pulsao para editar');
    }
  
    deleteInformation(artist: Artist){
      console.log('boton pulsao para borrar');
    }
  
  /* editInformation(song: Song): void {
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
  } */
}