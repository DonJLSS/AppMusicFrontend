import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';

@Component({
    imports:[MaterialModule, ReactiveFormsModule, CommonModule],
    selector: 'app-artist-page',
    templateUrl: 'artist-page.component.html',
    styleUrl:'artist-page.component.css',
    standalone: true,
})

export class ArtistPageComponent implements OnInit {
    myControl = new FormControl('');
    options: string[] = ['Title', 'Duration', 'Artist', 'Album'];
    filteredOptions: Observable<string[]> = of([]);

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}