import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload-details',
  templateUrl: './file-upload-details.component.html',
  styleUrls: ['./file-upload-details.component.scss']
})
export class FileUploadDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FileUploadDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
