import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { EmployeeMngmtService } from 'src/@dw/services/leave/employee-mngmt/employee-mngmt.service';
import { EmployeeRegisterStorageService } from 'src/@dw/store/employee-register-storage.service';

@Component({
	selector: 'app-pending-employee',
	templateUrl: './pending-employee.component.html',
	styleUrls: ['./pending-employee.component.scss']
})
export class PendingEmployeeComponent implements OnInit {

	// displayedColumns: string[] = ['name', 'email', 'acceptButton', 'cancelButton'];
	displayedColumns: string[] = ['name', 'email', 'acceptButton'];
	getPendingList = [];
	private unsubscribe$ = new Subject<void>();

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private employeeMngmtService: EmployeeMngmtService,
		private dialogService: DialogService,
		private employeeRegisterStorageService: EmployeeRegisterStorageService
	) { }

	ngOnInit(): void {
		this.getRegReqList();
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	
	}

	getRegReqList(){
		this.employeeMngmtService.getPending().subscribe(
			(data: any) => {
				console.log('[[pending-employee component]] >>', data);
				if (data.message == 'found') {
					this.getPendingList = data.pendingList
					console.log(this.getPendingList);
					this.employeeRegisterStorageService.updateRegReq(data.pendingList);

				} else {
					this.getPendingList = null;
				}
			},
			err => {
				console.log(err);
				this.dialogService.openDialogNegative(err.error.message);
				// alert(err.error.message);
			}
		);
		this.employeeRegisterStorageService.regReq$.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
			(data: any) => {
				this.getPendingList = data;
				console.log(this.getPendingList);
			}
		);
	}



	acceptRequest(docId, userId) {
		const sendData = {
			docId,
			userId
		}
		// const confirmRes = confirm(`Do you want to accept this employee's request?`);
		// if (confirmRes) {

		this.dialogService.openDialogConfirm(`Do you have this employee under your management?`).subscribe(result => {
			if (result) {
				this.employeeMngmtService.acceptRequest(sendData).subscribe(
					(data: any) => {
						if (data.message == 'accepted') {
							this.dialogService.openDialogPositive('Successfully, the employee is under your management.')
							this.getRegReqList();
						} else {
							console.log(data.message);
						}
					},
					err => {
						console.log(err);
						this.dialogService.openDialogNegative(err.error.message);
						// alert(err.error.message);
					}
				);
			}
		});
	}

	cancelRequest(docId) {
		// const confirmRes = confirm(`Do you want to cancel this employee's request?`);
		// if (confirmRes) {
		this.dialogService.openDialogConfirm(`Do you reject this employee's request?`).subscribe(result => {
			if (result) {
				this.employeeMngmtService.cancelRequest(docId).subscribe(
					(data: any) => {
						if (data.message == 'canceled') {
							this.dialogService.openDialogPositive('Successfully, the request has been rejected');
							this.getRegReqList();
						}
					},
					err => {
						console.log(err);
						this.dialogService.openDialogNegative(err.error.message);
						// alert(err.error.message);
					}
				);
			}
		});
	}
}
