import { LeavesService } from "./../../../services/leaves/leaves.service";
import { ProfilesService } from "./../../../services/profiles/profiles.service";
import { DialogService } from "./../../../stores/dialog/dialog.service";
import { CommonModule } from "@angular/common";
import { Component, ViewChild, effect, inject, signal } from "@angular/core";
import { MaterialsModule } from "../../../materials/materials.module";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { catchError, map, merge, of, startWith, switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { LeaveRequestDetailDialogComponent } from "../../../components/dialogs/leave-request-detail-dialog/leave-request-detail-dialog.component";

@Component({
	selector: "app-status",
	standalone: true,
	imports: [CommonModule, MaterialsModule],
	templateUrl: "./status.component.html",
	styleUrl: "./status.component.scss",
})
export class StatusComponent {
	dialogsService = inject(DialogService);
	profilesService = inject(ProfilesService);
	leavesService = inject(LeavesService);
	dialog = inject(MatDialog);
	displayedColumns: string[] = ["createAt", "leaveStartDate", "duration", "leaveType", "approver", "status"];
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	pageSize = signal<number>(10);
	resultsLength = signal<number>(0);
	isLoadingResults = signal<boolean>(true);
	isRateLimitReached = signal<boolean>(false);

	dataSource = signal<any[]>([]);

	userCompanyInfo = this.profilesService.userCompanyInfo;
	leaveInfo: any;

	viewType: any = {
		annual_leave: "Annual Leave",
		rollover: "Rollover",
		sick_leave: "Sick Leave",
		replacement_leave: "Replacement Day",
	};

	constructor() {
		effect(() => {
			if (this.userCompanyInfo()) {
				this.leavesService.getMyLeavesStatus().subscribe({
					next: (res: any) => {
						// console.log('get userLeaveStatus');
						this.leaveInfo = res;
						// leaveInfo의 rollover 값을 userCompanyInfo의 rollover_max_day와 비교하여 더 작은 값으로 설정
						this.leaveInfo.rollover = Math.min(
							this.leaveInfo.rollover,
							this.userCompanyInfo()?.rollover_max_day
						);
					},
					error: (err: any) => {
						console.log(err);
					},
				});
			}
		});
	}

	ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => this.getMyLeaveList()),
				map((res: any) => {
					console.log(res);
					this.isLoadingResults.set(false);
					if (res === null) {
						this.isRateLimitReached.set(true);
						return [];
					}
					this.isRateLimitReached.set(false);
					console.log(res.totalCount);
					this.resultsLength.set(res.totalCount);
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
					this.dataSource.set(data.leaveRequestList);
					console.log("요호호", data.leaveRequestList);
					if (data.length > 0) this.resultsLength.set(data.totalCount);
				}
			});
	}

	getMyLeaveList() {
		return this.leavesService
			.getMyLeaveList(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize)
			.pipe(catchError(() => of(null)));
	}

	openDialogPendingLeaveDetail(data: any) {
		const dialogRef = this.dialog.open(LeaveRequestDetailDialogComponent, {
			// width: '600px',
			// height: '614px',

			data: {
				requestor: data.requestor,
				requestorName: data.requestorName,
				leaveType: data.leaveType,
				leaveDuration: data.leaveDuration,
				leave_end_date: data.leave_end_date,
				leave_start_date: data.leave_start_date,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				approver: data.approver,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			console.log("dialog close");
		});
	}
}
