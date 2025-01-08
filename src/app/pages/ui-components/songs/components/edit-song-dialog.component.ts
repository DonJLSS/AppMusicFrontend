import { MaterialModule } from 'src/app/material.module';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-song-dialog',
  template: `
    <h2 mat-dialog-title>Edit Song</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <input matInput placeholder="Title" formControlName="title">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Artist" formControlName="artist">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Album" formControlName="album">
        </mat-form-field>
        <mat-form-field>
          <input matInput type="number" placeholder="Duration" formControlName="duration">
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
export class EditSongDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditSongDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: [data.title, Validators.required],
      artist: [data.artist, Validators.required],
      album: [data.album, Validators.required],
      duration: [data.duration, [Validators.required, Validators.min(1)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}