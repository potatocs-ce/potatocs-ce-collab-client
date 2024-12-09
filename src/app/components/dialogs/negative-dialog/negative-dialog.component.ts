import { Component, Inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-negative-dialog',
  standalone: true,
  imports: [MaterialsModule, CommonModule],
  templateUrl: './negative-dialog.component.html',
  styleUrl: './negative-dialog.component.scss',
})
export class NegativeDialogComponent {
  flag: boolean | undefined;

  constructor(
    public dialogRef: MatDialogRef<NegativeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.flag = true;
  }

  closeModal() {
    this.data.flag = false;
    this.dialogRef.close();
  }
}
