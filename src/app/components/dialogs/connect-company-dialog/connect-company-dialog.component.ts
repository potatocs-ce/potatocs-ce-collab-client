import { DialogService } from './../../../stores/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { CompaniesService } from '../../../services/companies/companies.service';

@Component({
  selector: 'app-connect-company-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './connect-company-dialog.component.html',
  styleUrl: './connect-company-dialog.component.scss'
})
export class ConnectCompanyDialogComponent {

  public dialogRef = inject(MatDialogRef<ConnectCompanyDialogComponent>);
  public data: any = Inject(MAT_DIALOG_DATA)
  addCodeInput = new FormControl('');
  addCode = ''; // 검색어.
  addBtn: boolean = false;

  dialogsService = inject(DialogService)
  companiesService = inject(CompaniesService)

  requestCompanyConnection() {
    const company_code = {
      company_code: this.addCodeInput.value,
    };
    this.dialogsService.openDialogConfirm('Do you want to register a company?').subscribe(result => {
      if (result) {
        this.companiesService.requestCompanyConnection(company_code).subscribe(
          {
            next: (value: any) => {
              this.dialogRef.close();
              this.dialogsService.openDialogPositive('Successfully, the process has done!');
            },
            error: (err: any) => {
              if (err.error.message == '4') {
                this.dialogsService.openDialogNegative('Already has a pending request.');
                // alert('Already has a pending request.');
              } else if (err.error.message == '5') {
                this.dialogsService.openDialogNegative('Wrong code. Try again.');
                // alert('Wrong code. Try again.');
              }
              this.addCodeInput.setValue('');
            }
          }

        );
      }
    });
  }
  getRequestCompanyConnectionStatus() {
    this.companiesService.getRequestCompanyConnectionStatus().subscribe({
      next: (data: any) => {

      },
      error: (err: any) => {
        console.log(err);
      },
    }
    );
  }
}
