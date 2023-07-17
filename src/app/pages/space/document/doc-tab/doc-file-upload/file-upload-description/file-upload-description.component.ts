import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload-description',
  templateUrl: './file-upload-description.component.html',
  styleUrls: ['./file-upload-description.component.scss']
})
export class FileUploadDescriptionComponent implements OnInit {


  fileUpload = new FormGroup({
    description: new FormControl()
  });

  constructor(
    public dialogRef: MatDialogRef<FileUploadDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }



  ngOnInit(): void {
  }

  descriptionMade() {
    const formValue = this.fileUpload.value;
    console.log(formValue)


    const description = {
      ...formValue.description
    };
    this.data.description = description;

    this.dialogRef.close(this.data);
  }

}
