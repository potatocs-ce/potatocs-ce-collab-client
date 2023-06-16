import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.scss']
})
export class CalendarEditComponent implements OnInit {

  form = this.fb.group({
    docId: null,
    title: null,
    start: null,
    end: null
  });
  docId;

  constructor(
    private dialogRef: MatDialogRef<CalendarEditComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private  docService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public event: CalendarEvent<any>,

  ) { }

  ngOnInit(): void {
    console.log(11111111);
    this.form.patchValue(this.event);
    console.log(212222222222);
    console.log(this.event);
    // console.log(this.form.value);
  }

  
  save() {
    console.log(this.form.value);
    const data = {
      _id : this.form.value.docId,
      docTitle : this.form.value.title,
      startDate : this.form.value.start,
      endDate : this.form.value.end
    }

    this.docService.editDocDate(data).subscribe(
      (data: any) => {
        console.log(data);
      },
      (err: any) => {
        console.log(err);
      }
    )
    console.log(this.event);
    console.log(this.form.value)
    this.dialogRef.close({
      ...this.event,
      ...this.form.value
    });
  }
}
