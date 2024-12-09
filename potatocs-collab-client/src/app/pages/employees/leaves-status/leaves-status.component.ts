import { Component, ViewChild, inject, signal } from "@angular/core";
import { MaterialsModule } from "../../../materials/materials.module";
import { AsyncPipe, CommonModule } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DialogService } from "../../../stores/dialog/dialog.service";
import moment from "moment";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Observable, catchError, map, merge, of, startWith, switchMap } from "rxjs";
import { LeavesService } from "../../../services/leaves/leaves.service";
import { CommonService } from "../../../services/common/common.service";
import { EmployeesService } from "../../../services/employees/employees.service";
import { MatDialog } from "@angular/material/dialog";
import { LeaveRequestDetailDialogComponent } from "../../../components/dialogs/leave-request-detail-dialog/leave-request-detail-dialog.component";

@Component({
	selector: "app-leaves-status",
	standalone: true,
	imports: [MaterialsModule, CommonModule, AsyncPipe],
	templateUrl: "./leaves-status.component.html",
	styleUrl: "./leaves-status.component.scss",
})
export class LeavesStatusComponent {
	leavesService = inject(LeavesService);
	employeesService = inject(EmployeesService);
	dialog = inject(MatDialog);
	commonService = inject(CommonService);
	dialogsService = inject(DialogService);
	fb = inject(FormBuilder);

	filteredOptions!: Observable<any[]>;
	options: any;

	displayedColumns: string[] = ["startDate", "endDate", "name", "emailFind", "leaveType", "duration", "status"];
	viewType: any = {
		annual_leave: "Annual Leave",
		rollover: "Rollover",
		sick_leave: "Sick Leave",
		replacement_leave: "Replacement Day",
	};

	startOfMonth = moment().startOf("month").format();
	endOfMonth = moment().endOf("month").format();

	employeeForm: FormGroup = this.fb.group({
		type: ["all", [Validators.required]],
		leave_start_date: [this.startOfMonth, [Validators.required]],
		leave_end_date: [this.endOfMonth, [Validators.required]],
		emailFind: ["", [Validators.required]],
	});

	myControl = new FormControl();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	pageSize = signal<number>(10);
	resultsLength = signal<number>(0);
	isLoadingResults = signal<boolean>(true);
	isRateLimitReached = signal<boolean>(false);

	dataSource = signal<any[]>([]);

	private _filter(value: any): any[] {
		const filterValue = value?.toLowerCase();
		console.log(filterValue);
		return this.options.filter((option: any) => option?.email?.toLowerCase().includes(filterValue));
	}

	ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => this.getLeavesStatus(this.getFormValue())),
				map((res: any) => {
					this.isLoadingResults.set(false);
					if (res === null) {
						this.isRateLimitReached.set(true);
						return [];
					}
					this.isRateLimitReached.set(false);
					console.log(res.total_count);
					this.resultsLength.set(res.total_count);
					return res;
				}),
				catchError(() => {
					this.isLoadingResults.set(false);
					this.isRateLimitReached.set(true);
					return of([]);
				})
			)
			.subscribe((data: any) => {
				if (data) {
					console.log("ㅎㅇㅎㅇㅎㅇㅎㅇ", data);

					this.dataSource.set(data.myEmployeeLeaveListSearch);
					console.log("요호호", data.leaveRequestList);
					this.options = data.myEmployeeList;
					if (this.options.length > 0) {
						// 매니저가 관리하는 유저 수가 한명 이상일 경우
						this.filteredOptions = this.myControl.valueChanges.pipe(
							startWith(""),
							map((value: any) => this._filter(value.email || ""))
						);
					}
				}
			});
	}

	getFormValue() {
		const formValue = this.employeeForm.value;
		return {
			type: formValue.type,
			leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
			leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),
			emailFind: this.myControl.value,
		};
	}

	getLeavesStatus(employeeInfo: any) {
		this.isLoadingResults.set(true);
		return this.employeesService
			.getMyEmployeesLeavesListSearch(
				employeeInfo,
				this.sort.active,
				this.sort.direction,
				this.paginator.pageIndex,
				this.paginator.pageSize
			)
			.pipe(catchError(() => of(null)));
	}

	searchBtn() {
		this.paginator.pageIndex = 0;
		this.getLeavesStatus(this.getFormValue()).subscribe((res: any) => {
			this.isLoadingResults.set(false);
			if (res === null) {
				this.isRateLimitReached.set(true);
			} else {
				this.isRateLimitReached.set(false);
				this.resultsLength.set(res.total_count);
				this.dataSource.set(res.myEmployeeLeaveListSearch);
			}
		});
	}

	openDialogPendingLeaveDetail(data: any) {
		console.log(data);
		data.isManager = true;
		const dialogRef = this.dialog.open(LeaveRequestDetailDialogComponent, {
			data: {
				_id: data.requestId,
				requestor: data._id,
				requestorName: data.name,
				leaveType: data.leaveType,
				leaveDuration: data.duration,
				leave_end_date: data.endDate,
				leave_start_date: data.startDate,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				approver: data.approver,
				rejectReason: data.rejectReason,
				isManager: true,
			},
		});
		//닫힌후에 테이블 갱신
		dialogRef.afterClosed().subscribe((result) => {
			merge(this.sort.sortChange, this.paginator.page)
				.pipe(
					startWith({}),
					switchMap(() => this.getLeavesStatus(this.getFormValue())),
					map((res: any) => {
						this.isLoadingResults.set(false);
						if (res === null) {
							this.isRateLimitReached.set(true);
							return [];
						}
						this.isRateLimitReached.set(false);
						this.resultsLength.set(res.total_count);
						return res;
					}),
					catchError(() => {
						this.isLoadingResults.set(false);
						this.isRateLimitReached.set(true);
						return of([]);
					})
				)
				.subscribe((data: any) => {
					if (data) {
						console.log("ㅎㅇㅎㅇㅎㅇㅎㅇ", data);

						this.dataSource.set(data.myEmployeeLeaveListSearch);

						this.options = data.myEmployeeList;
						if (this.options.length > 0) {
							// 매니저가 관리하는 유저 수가 한명 이상일 경우
							this.filteredOptions = this.myControl.valueChanges.pipe(
								startWith(""),
								map((value: any) => this._filter(value.email || ""))
							);
						}
					}
				});
		});
	}
}
