import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/@dw/services/common/common.service';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { EmployeeMngmtService } from 'src/@dw/services/leave/employee-mngmt/employee-mngmt.service';


@Component({
	selector: 'app-edit-employee-info',
	templateUrl: './edit-employee-info.component.html',
	styleUrls: ['./edit-employee-info.component.scss']
})
export class EditEmployeeInfoComponent implements OnInit {

	employeeId;
	getEmployeeInfo;

	// FormGroup
	employeeForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private employeeMngmtService: EmployeeMngmtService,
		private commonService: CommonService,
		private dialogService: DialogService

	) { }

	ngOnInit(): void {

		this.employeeForm = this.fb.group({
			name: ['', [
				Validators.required,
			]],
			position: ['', [
				Validators.required,
			]],
			location: ['', [
				Validators.required,
			]],
			emp_start_date: ['', [
				Validators.required,
			]],
			emp_end_date: ['', [
				Validators.required,
			]],
			annual_leave: ['', [
				Validators.required,
			]],
			sick_leave: ['', [
				Validators.required,
			]],
			replacementday_leave: ['', [
				Validators.required,
			]]
		});


		this.employeeId = this.route.snapshot.params.id;

		this.employeeMngmtService.getEmployeeInfo(this.employeeId).subscribe(
			(data: any) => {

				this.getEmployeeInfo = data.employee;
				this.setEmployeeFormValue(this.getEmployeeInfo);
			}
		);
	}

	setEmployeeFormValue(user) {
		this.employeeForm.get('name').setValue(user.name);
		this.employeeForm.get('position').setValue(user.position);
		this.employeeForm.get('location').setValue(user.location);
		this.employeeForm.get('emp_start_date').setValue(user.emp_start_date);
		this.employeeForm.get('emp_end_date').setValue(user.emp_end_date);
		this.employeeForm.get('annual_leave').setValue(user.annual_leave);
		this.employeeForm.get('sick_leave').setValue(user.sick_leave);
		this.employeeForm.get('replacementday_leave').setValue(user.replacementday_leave);
	}

	isFieldInvalid(field: string) {
		return !this.employeeForm.get(field).valid;
	}

	backManagerList(){
		this.router.navigate(['employee-mngmt/manager-list']);
	}

	updateInfo() {
		let employeeInfo;
		const formValue = this.employeeForm.value;

		if (this.isFieldInvalid('name')) {
			this.dialogService.openDialogNegative('Please input a name');
			// alert('Please input a name');
			return;
		}
		employeeInfo = {
			employeeId: this.employeeId,
			name: formValue.name,
			position: formValue.position,
			location: formValue.location,
			emp_start_date: this.commonService.dateFormatting(formValue.emp_start_date),
			emp_end_date: this.commonService.dateFormatting(formValue.emp_end_date),
			annual_leave: +formValue.annual_leave,
			sick_leave: +formValue.sick_leave,
			replacementday_leave: +formValue.replacementday_leave,
		}
		if(formValue.emp_start_date == null){
			employeeInfo.emp_start_date = null;
		}
		if(formValue.emp_end_date == null){
			employeeInfo.emp_end_date = null;
		}

		this.employeeMngmtService.putEmployeeInfo(employeeInfo).subscribe(
			(data: any) => {

				if (data.message == 'updated') {
					this.router.navigate(['employee-mngmt/manager-list']);
				}
			},
			err => {
				console.log(err);
				this.dialogService.openDialogNegative(err.error.message);
				// alert(err.error.message);
			}
		);
	}

}
