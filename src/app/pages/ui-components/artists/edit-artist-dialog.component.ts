import { MaterialModule } from 'src/app/material.module';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-artist-dialog',
  template: `
    <h2 mat-dialog-title>Artist Information</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Nationality" formControlName="nationality">
        </mat-form-field>
        <mat-form-field>
          <input matInput [matDatepicker]="picker" placeholder="Date of Birth" formControlName="dateOfBirth">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <input matInput type="number" placeholder="Albums Count" formControlName="albumsCount">
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
export class EditArtistDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditArtistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    
    this.form = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
      nationality: [data.nationality, Validators.required],
      dateOfBirth: [data.dateOfBirth, Validators.required],
      albumsCount: [data.albumsCount, [Validators.required, Validators.min(0)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}