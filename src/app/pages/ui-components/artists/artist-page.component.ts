import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

import { EditArtistDialogComponent } from './edit-artist-dialog.component';
import { ArtistService } from '../songs/service/artist.service';
import { Artist } from 'src/app/model/artists/artist.interface';
import routeAnimationsState from '../shared/route-animations';
import { trigger, transition, style, animate, state } from '@angular/animations';


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
  
  editInformation(artist: Artist): void {
    const dialogRef = this.dialog.open(EditArtistDialogComponent, {
      width: '400px',
      data: { ...artist }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Check if dateOfBirth is a string before parsing
      if (typeof result.dateOfBirth === 'string') {
        result.dateOfBirth = this.parseDate(result.dateOfBirth);
      } else if (result.dateOfBirth instanceof Date) {
        // If it's already a Date object, no need to parse
        result.dateOfBirth = new Date(result.dateOfBirth);
      } else {
        console.error('Invalid date format:', result.dateOfBirth);
        return; // Exit if the date is invalid
      }
        this.artistService.updateArtist(artist.id,result).subscribe(
          updatedArtist => {
            const index = this.artists.findIndex(s => s.id === updatedArtist.id);
            if (index !== -1) {
              this.artists[index] = updatedArtist;
              this.applyFilters();
            }
            console.log('Artist updated successfully');
          },
          error => {
            console.error('Error updating artist:', error);
          }
        );
      }
    });
  }

  private parseDate(dateString: string): Date {
    if (!dateString) return new Date(); 
    if (dateString.includes('-')) {
      return new Date(dateString);
    }
    const [day, month, year] = dateString.split('/');
    if (day && month && year) {
      return new Date(+year, +month - 1, +day);
    }
    console.error('Invalid date format:', dateString);
    return new Date();
  }
 
  

  deleteInformation(artist: Artist): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { 
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this artist?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const index = this.artists.findIndex(a => a.id === artist.id);
        if (index !== -1) {
          this.artists.splice(index, 1);
          this.applyFilters();
        }
        this.artistService.deleteArtist(artist.id).subscribe(() => {
          console.log('Artist deleted successfully');
        });
      }
    });
  } 
}