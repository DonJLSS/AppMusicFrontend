import { MaterialModule } from 'src/app/material.module';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-album-dialog',
    template: `
    <h2 mat-dialog-title>Album Information</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <input matInput placeholder="Title" formControlName="title">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Artist" formControlName="artistName">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Description" formControlName="description">
        </mat-form-field>
        <mat-form-field>
          <input matInput type="number" placeholder="Release Year" formControlName="launchYear">
        </mat-form-field>
        <mat-form-field>
          <input matInput type="number" placeholder="Songs Count" formControlName="songsCount">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button color="primary" [mat-dialog-close]="form.value" [disabled]="!form.valid">Save</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule]
})

export class EditAlbumDialogComponent {

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditAlbumDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) { 
        this.form = this.fb.group({
            id: [data.id],
            title: [data.title, Validators.required],
            artistName: [data.artistName, Validators.required],
            description: [data.description],
            launchYear: [data.launchYear, Validators.required],
            songsCount: [data.songsCount, [Validators.required, Validators.min(0)]]
        });
    }


    onNoClick(): void {
        this.dialogRef.close();
    }
}