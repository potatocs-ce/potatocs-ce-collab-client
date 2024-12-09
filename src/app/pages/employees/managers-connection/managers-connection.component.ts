import { DialogService } from './../../../stores/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { EmployeesService } from '../../../services/employees/employees.service';

@Component({
  selector: 'app-managers-connection',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './managers-connection.component.html',
  styleUrl: './managers-connection.component.scss'
})
export class ManagersConnectionComponent {

  dialogsService = inject(DialogService)
  employeesService = inject(EmployeesService)
  pendingList: WritableSignal<any[]> = this.employeesService.pendingList

  // displayedColumns: string[] = ['name', 'email', 'acceptButton', 'cancelButton'];
  displayedColumns: string[] = ['name', 'email', 'acceptButton'];
  getPendingList = [];


  ngAfterViewInit() {
    this.getRegReqList()
  }

  getRegReqList() {
    this.employeesService.getPending().subscribe({
      next: (res: any) => {
        console.log('[[pending-employee component]] >>', res);
      },
      error: (err: any) => {
        console.log(err);
        this.dialogsService.openDialogNegative(err.error.message);
        // alert(err.error.message);
      }
    });
  }


  acceptRequest(docId: any, userId: any) {
    const sendData = {
      docId,
      userId
    }
    // const confirmRes = confirm(`Do you want to accept this employee's request?`);
    // if (confirmRes) {

    this.dialogsService.openDialogConfirm(`Do you have this employee under your management?`).subscribe(result => {
      if (result) {
        this.employeesService.acceptRequest(sendData).subscribe(
          {
            next: (res: any) => {
              if (res.message == 'accepted') {
                this.dialogsService.openDialogPositive('Successfully, the employee is under your management.')
                this.getRegReqList();
              }
            },
            error: (err: any) => {
              this.dialogsService.openDialogNegative(err.error.message);
            }
          })
      }
    });
  }

  cancelRequest(docId: any) {
    // const confirmRes = confirm(`Do you want to cancel this employee's request?`);
    // if (confirmRes) {
    this.dialogsService.openDialogConfirm(`Do you reject this employee's request?`).subscribe(result => {
      if (result) {
        this.employeesService.cancelRequest(docId).subscribe({
          next: (res: any) => {
            if (res.message == 'canceled') {
              this.dialogsService.openDialogPositive('Successfully, the request has been rejected');
              this.getRegReqList();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.dialogsService.openDialogNegative(err.error.message);
          }
        })

      }
    })

  }
}
