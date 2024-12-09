import { ProfilesService } from './../../../../services/profiles/profiles.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../../materials/materials.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import { CommonService } from '../../../../services/common/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeavesService } from '../../../../services/leaves/leaves.service';

@Component({
  selector: 'app-replacements-day-requests-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './replacements-day-requests-dialog.component.html',
  styleUrl: './replacements-day-requests-dialog.component.scss'
})
export class ReplacementsDayRequestsDialogComponent {

  data: any = inject(MAT_DIALOG_DATA)
  public dialogRef = inject(MatDialogRef<ReplacementsDayRequestsDialogComponent>)
  dialogsService = inject(DialogService)
  commonService = inject(CommonService)
  formBuilder = inject(FormBuilder)
  leavesService = inject(LeavesService)
  fb = inject(FormBuilder)
  profilesService = inject(ProfilesService)

  // Form
  rdLeaveForm: FormGroup = this.fb.group({
    leaveType1: ['', [Validators.required]],
    leaveType2: ['', [Validators.required]],
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    leave_reason: ['', [Validators.required]],
  });
  start_date_sec: any;
  end_date_sec: any;
  millisecondsPerDay: any;
  diff: any;
  weeks: any;
  leaveDays: any;



  displayedColumns: string[] = ['name', 'from', 'to', 'type', 'days', 'manager', 'status', 'btns'];

  // Signals
  leaveDuration = signal<number>(0);
  isHalf = signal<boolean>(false);



  ngOnInit() {
    this.datePickDisabled();
  }

  requestConfirmRd() {
    const formValue = this.rdLeaveForm.value;
    let rdRequestData = {};

    // Convert and validate dates
    const fromDate = formValue.from ? new Date(formValue.from) : null;
    const toDate = formValue.to ? new Date(formValue.to) : null;

    if (!fromDate || isNaN(fromDate.getTime()) || (toDate && isNaN(toDate.getTime()))) {
      console.error('Invalid date input');
      return;
    }

    const formattedFrom = this.commonService.dateFormatting(fromDate);
    const formattedTo = (toDate && this.leaveDuration() !== 0.5) ? this.commonService.dateFormatting(toDate) : formattedFrom;

    rdRequestData = {
      leaveType: formValue.leaveType1,
      leaveDay: formValue.leaveType2,
      leaveDuration: this.leaveDuration(),
      leave_start_date: formattedFrom,
      leave_end_date: formattedTo,
      leave_reason: formValue.leave_reason,
      status: 'pending'
    };

    this.leavesService.requestConfirmRd(rdRequestData).subscribe({
      next: (res: any) => {
        if (res.message === 'requestConfirmRd') {
          this.dialogRef.close();
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  classificationChange(value: any) {
    this.rdLeaveForm.get('leaveType2')?.setValue('');
    this.datePickDisabled();
    this.datePickReset();
  }

  typeSecondChange(value: any) {
    if (value === 'half') {
      this.rdLeaveForm.controls['from'].enable();
      this.rdLeaveForm.controls['to'].disable();
      this.datePickReset();
      this.isHalf.set(true);
    } else {
      this.rdLeaveForm.controls['from'].enable();
      this.rdLeaveForm.controls['to'].enable();
      this.datePickReset();
      this.isHalf.set(false);
    }
  }

  checkDateChange(value: any) {
    const formValue = this.rdLeaveForm.value;
    const startDate = formValue.from ? new Date(formValue.from) : null;
    const endDate = formValue.to ? new Date(formValue.to) : null;

    if (!startDate || isNaN(startDate.getTime()) || (endDate && isNaN(endDate.getTime()))) {
      this.dialogsService.openDialogNegative('Invalid date input');
      return;
    }

    if (this.isHalf()) {
      this.leaveDuration.set(0.5);
      this.rdLeaveForm.get('to')?.setValue('');

      if (this.leaveDuration() < 0) {
        this.dialogsService.openDialogNegative('Wrong period, Try again.');
        this.allReset();
        return;
      }
    } else {
      if (startDate && endDate) {
        const diff = this.calculateDiff(startDate, endDate);
        this.leaveDuration.set(diff);

        if (this.leaveDuration() < 0) {
          this.dialogsService.openDialogNegative('Wrong period, Try again.');
          this.allReset();
          return;
        }
      }
    }
  }

  datePickChange(dateValue: any) {
    this.rdLeaveForm.get('to')?.setValue('');
  }

  calculateDiff(start_date: Date, end_date: Date) {
    const millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    const start_date_sec = start_date.setHours(0, 0, 0, 1); // Start just after midnight
    const end_date_sec = end_date.setHours(23, 59, 59, 999); // End just before midnight
    const diff = end_date_sec - start_date_sec; // Milliseconds between datetime objects
    let days = Math.ceil(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    const weeks = Math.floor(days / 7);
    days -= weeks * 2;

    // Handle special cases
    const startDay = start_date.getDay();
    const endDay = end_date.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 1) {
      days -= 2;
    }

    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay === 0 && endDay !== 6) {
      days -= 1;
    }

    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay === 6 && startDay !== 0) {
      days -= 1;
    }

    return days;
  }

  datePickReset() {
    this.rdLeaveForm.get('from')?.setValue('');
    this.rdLeaveForm.get('to')?.setValue('');
  }

  datePickDisabled() {
    this.rdLeaveForm.controls['from'].disable();
    this.rdLeaveForm.controls['to'].disable();
  }

  allReset() {
    this.rdLeaveForm.get('leaveType1')?.setValue('');
    this.rdLeaveForm.get('leaveType2')?.setValue('');
    this.datePickReset();
    this.datePickDisabled();
  }
}
