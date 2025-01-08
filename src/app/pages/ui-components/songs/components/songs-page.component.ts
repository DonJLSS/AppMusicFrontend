import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from "../../../../pipes/pipes.module";
import { MatDialog } from '@angular/material/dialog';
import { EditSongDialogComponent } from './edit-song-dialog.component';
export interface Section {
  name: string;
  updated: Date;
}

@Component({

  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule
],
  standalone: true,
  selector: 'app-songs-page',
  templateUrl: './songs-page.component.html',
  styleUrl: './songs-page.component.css'
})
export class SongsPageComponent implements OnInit {
  constructor(private dialog: MatDialog) {}


  filteredSongs = [
    { title: 'Psycho Killer', artist: 'Talking Heads', album: 'Talking Heads: 77', duration: 270 },
    { title: 'Once in a Lifetime', artist: 'Talking Heads', album: 'Remain in Light', duration: 240 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
    { title: 'Burning Down the House', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: 230 },
  ];


  myControl = new FormControl('');
  sortOptions: string[] = ['Title', 'Duration', 'Artist', 'Album'];
  filteredOptions: Observable<string[]> = of([]);

  ngOnInit() {
   /*  this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    ); */
  }

  onSortOptionSelect(option: string): void {
    console.log('Selected sort option:', option);
    if(option === 'Duration')
      this.filteredSongs = this.filteredSongs.sort((a, b) => a.duration - b.duration);
    if(option === 'Title')
      this.filteredSongs = this.filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
    if(option === 'Artist')
      this.filteredSongs = this.filteredSongs.sort((a, b) => a.artist.localeCompare(b.artist));
    if(option === 'Album')
      this.filteredSongs = this.filteredSongs.sort((a, b) => a.album.localeCompare(b.album));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.sortOptions.filter(option => option.toLowerCase().includes(filterValue));
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
        const index = this.filteredSongs.findIndex(s => s === song);
        if (index !== -1) {
          this.filteredSongs[index] = { ...result };
        }
      }
    });
  }




  
}
