import { DialogService } from './../../../stores/dialog/dialog.service';
import { ManagersService } from './../../../services/managers/managers.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialsModule } from '../../../materials/materials.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connect-manager-dialog-component',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './connect-manager-dialog-component.component.html',
  styleUrl: './connect-manager-dialog-component.component.scss'
})
export class ConnectManagerDialogComponentComponent {
  public dialogRef = inject(MatDialogRef<ConnectManagerDialogComponentComponent>);
  public data: any = inject(MAT_DIALOG_DATA)
  managersService = inject(ManagersService)
  dialogsService = inject(DialogService)
  fb = inject(FormBuilder)
  searchStr = ''; // 검색어.
  manager: any;

  managerInfo: any;
  // displayedColumns: string[] = ['name', 'email', 'acceptButton', 'cancelButton'];
  displayedColumns: string[] = ['name', 'email', 'acceptButton']
  emailForm: FormGroup = this.fb.group({
    email: new FormControl('',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
      ]
    )
  });

  constructor() {
    console.log(this.data)
  }

  addManager() {

    this.dialogsService.openDialogConfirm('Do you want to register a manager?').subscribe(result => {
      if (result) {
        this.managersService.addManager(this.manager[0]._id).subscribe({
          next: (res: any) => {

            this.dialogsService.openDialogPositive('Successfully, the process has done');
            if (res.message == 'requested') {
            }
            this.dialogRef.close();
          },
          error: (error: any) => {
            console.log(error);
            this.dialogsService.openDialogNegative('an Error while adding\nTry again.');
          }
        });
      }
    });
  }

  findManager() {

    const sendData = {
      searchStr: this.emailForm.value.email,
      company_id: this.data.company_id,
    };
    console.log(sendData)
    this.managersService.findManager(sendData).subscribe({
      next: (res: any) => {
        this.manager = [res.user];
      },
      error: (err: any) => {
        this.dialogsService.openDialogNegative(err.error.message);
      }
    });
  }
}