import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import * as moment from 'moment';

// Env
import { environment } from 'src/environments/environment';

// Service
import { CommonService } from 'src/@dw/services/common/common.service';
import { DataService } from 'src/@dw/store/data.service';
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { FindManagerService } from 'src/@dw/services/leave/find-manager/find-manager.service'
import { CompanyService } from 'src/@dw/services/leave/company/company.service';
import { LayoutService } from 'src/@dw/services/layout.service';

// Interface
import { ViewType } from 'src/@dw/interfaces/viewType.interface';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {


	private API_URL = environment.API_URL;
	currentDate;
	// 휴가 변수들
	leaveInfo;
	// 3개월 전부터 지금까지 신청한 휴가 변수
	viewType:ViewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacement_leave': 'Replacement Day'
	}
	spaceAlarm;
	meeting;
	// leave;
	company;
	manager;
	meetingArray;
	displayedColumns: string[] = ['spaceName', 'docTitle', 'meetingTitle', 'start_date', 'Enter',];
	userInfo;

	// rollover에 사용되는 변수
	minDate;
	maxDate;
	isRollover = false;

	// dash board common height
	dashCommonHeight;
	isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
	resizeObservable$: Observable<Event>
	private unsubscribe$ = new Subject<void>();

	constructor(
		public dialog: MatDialog,
		private docService: DocumentService,
		private leaveMngmtService: LeaveMngmtService,
		private router: Router,
		private dialogService: DialogService,
		private findManagerService: FindManagerService,
		private companyService: CompanyService,
		private dataService: DataService,
		private commonService: CommonService,
		private layoutService: LayoutService,
	) { 
		
	}

	ngOnInit(): void {
		this.dataService.userProfile.subscribe(
			(data: any) => {
				this.calculateTenure(data);
				this.userInfo = data;
				// console.log(this.userInfo);
			}
		);

		const dashH = document.getElementById('dash').offsetHeight;
		const leaveBalH = document.getElementById('leaveBalance').offsetHeight;

		if(dashH > leaveBalH) {
			this.dashCommonHeight = dashH;
		} else {
			this.dashCommonHeight = leaveBalH;
		}
		this.resizeObservable$ = fromEvent(window, 'resize')
		this.resizeObservable$.pipe(
			takeUntil(this.unsubscribe$),
			withLatestFrom(this.isDesktop$), // isDesktop$을 같이 참조
      		filter(([event, isDesktop]) => isDesktop), // desktop인 상태에서만 넘어가도록 설정
			).subscribe( 
			evt => {
				const dashH = document.getElementById('dash').offsetHeight;
				const leaveBalH = document.getElementById('leaveBalance').offsetHeight;

			if(dashH > leaveBalH) {
				this.dashCommonHeight = dashH;
			} else {
				this.dashCommonHeight = leaveBalH;
			}

			console.log(this.dashCommonHeight);
		});

		// // space info 보류
		// this.mainService.getMainInfo().subscribe(
		// 	(data: any) => {
		// 		console.log(data);
		// 		this.spaceAlarm = data.spaceHistory;
		// 		// this.company = data.company[0];
		// 		// this.manager = data.manager[0];
		// 		this.meetingArray = data.meeting

		// 		console.log(this.spaceAlarm);
		// 		console.log(this.company);
		// 	},
		// 	(err: any) => {
		// 		console.log(err);
		// 	}
		// )
		// this.companyService.getPendingCompanyRequest().subscribe(
		// 	async (data: any) => {
		// 		await this.pendingCompReqStorageService.pendingData.subscribe(
		// 			(res: any) => {
		// 				this.company = res;
		// 				console.log(this.company);
		// 			},
		// 			(err: any) => {

		// 			}
		// 		)
		// 	},
		// 	(err: any) => {
		// 		console.log(err);
		// 	}
		// );	
		// this.findManagerService.getManagerInfo().subscribe(
		// 	async (data: any) => {
		// 		await this.pendingFindManagerStorageService.pendingData.subscribe(
		// 			(res: any) => {
		// 				this.manager = res;
		// 				console.log('storage 에서 받아옴',this.manager);
		// 			},
		// 			(err: any) => {

		// 			}
		// 		)
		// 	},
		// 	(err: any) => {
		// 		console.log(err);
		// 	}
		// );
		this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.company = data
				// console.log(data);
				if (data == null){
					return;
				}
				this.rolloverDate();

				// 휴가 status 회사 이월 때문에 여기로
				this.leaveMngmtService.getMyLeaveStatus().subscribe(
					(data: any) => {

						this.leaveInfo = data;
						this.leaveInfo.rollover = Math.min(this.leaveInfo.rollover, this.company.rollover_max_day);
					}
				);
			},
			(err: any) => {
				console.log(err);
			}
		);	
		this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.manager = data;
			},
			(err: any) => {
				console.log(err);
			}
		);

		this.currentDate = new Date();
	}

	ngAfterViewInit() {

		

	}
	
	// meeting
	joinMeeting(data) {
		window.open(this.API_URL + '/meeting/room/' + data._id);

	}


	// space issue 누르면 이동하는거
	naviSpaceDoc(item){
		if(item.type == 1){
			this.router.navigate(['main/collab/space/' + item.spaceTime]);
		}
		else if(item.type == 2){
			const docQuery = {
				id: item.doc_id
			}
			this.router.navigate(['main/collab/space/' + item.spaceTime + '/doc'], {queryParams: docQuery});
		}
	}


	// rollover 사용기간
	rolloverDate(){
		this.minDate = '';
		this.maxDate = '';

		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				if( this.company.rollover_max_month == null || this.company.rollover_max_month == '' ){
					
					return;
				}
				else {
					this.isRollover = true;
					// n년차 계산
					const today = moment(new Date());
					const empStartDate = moment(data.emp_start_date);
					const careerYear = (today.diff(empStartDate, 'years'));
	
					// 계약 시작일에 n년 더해주고, max에는 회사 rollover 규정 더해줌
					this.minDate = moment(data.emp_start_date).add(careerYear, 'y').format('YYYY-MM-DD');

					this.maxDate = moment(this.minDate).add(this.company.rollover_max_month, "M").subtract(1,'days').format('YYYY-MM-DD');

				}
			}
		)
	}


	calculateTenure(data) {
		var date = new Date();

		var start = this.commonService.dateFormatting(data.emp_start_date);
		var end = this.commonService.dateFormatting(data.emp_end_date);

		var startDate = moment(start, 'YYYY-MM-DD');
		var endDate = moment(end, 'YYYY-MM-DD');
		var today = moment(this.commonService.dateFormatting(date), 'YYYY-MM-DD');

		data.tenure_today = this.yearMonth(startDate, today)
	}
	yearMonth(start, end) {
		var monthDiffToday = end.diff(start, 'months');
		if (isNaN(monthDiffToday)) {
			return '-'
		}
		var tmp = monthDiffToday
		monthDiffToday = tmp % 12;
		var yearDiffToday = (tmp - monthDiffToday) / 12;

		return yearDiffToday + ' Years ' + monthDiffToday + ' Months'
	}


	// 매니저
	openDialogFindMyManager(): Observable<boolean> {

		if(this.company?.status == 'pending' || this.company == null){
			this.dialogService.openDialogNegative('Please, register a company first.');
		}
		else{
			const dialogRef = this.dialog.open(ManagerComponent, {
				data: {
					company_id: this.company._id
				}
	
			});
			return dialogRef.afterClosed();
		}
	}

	deleteManager(getManagerId) {

		this.dialogService.openDialogConfirm('Do you want to delete the manager?').subscribe(result => {
			if (result) {

				this.leaveMngmtService.checkPendingLeave().subscribe(
					(data: any) => {
						console.log(data);

						if(data.pendingFlag){
							this.findManagerService.deletePending(getManagerId).subscribe(
								(data: any) => {
									if (data.message == 'delete') {
										this.dataService.updateUserManagerProfile(null);
										this.dialogService.openDialogPositive('Successfully, the process has done');
									}
								},
								err => {
									console.log(err);
									this.dialogService.openDialogNegative(err.error.message);
								}
							);
						}
						else{
							this.dialogService.openDialogNegative(`current manager has the suspended leave you applied for.\nIf you want to change your manager, cancel your leave`)
						}


					},
					(err: any) => {

					}
				)
				
			}
		});
	}



	// 회사
	openDialogFindMyCompany(): Observable<boolean> {

		const dialogRef = this.dialog.open(CompanyComponent, {

		});

		return dialogRef.afterClosed();
	}

	deleteCompany(request_id){
		console.log(request_id);
		this.dialogService.openDialogConfirm('Do you want to delete the company?').subscribe(result =>{
			if(result){
				this.companyService.deleteCompanyRequest(request_id).subscribe(
					(data: any) => {
						this.dataService.updateUserCompanyProfile(null);
						this.dialogService.openDialogPositive('Successfully, the process has done!');
					},
					(err: any) => {
						console.log(err);
						this.dialogService.openDialogNegative(err);
					}
				)
			}
		});
	}

	ngOnDestroy(): void {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
		
	}
}

// manager
@Component({
	selector: 'app-find-manager',
	templateUrl: './find-manager.html',
	styleUrls: ['./main.component.scss']
})
export class ManagerComponent implements OnInit {
	searchStr = ''; // 검색어.
	manager: any;
	hasManager: boolean;
	managerInfo: any;
	searchBtn: boolean;
	// displayedColumns: string[] = ['name', 'email', 'acceptButton', 'cancelButton'];
	displayedColumns: string[] = ['name', 'email', 'acceptButton'];
	constructor(
		public dialogRef: MatDialogRef<ManagerComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private findManagerService: FindManagerService,
		private dialogService: DialogService,
		private dataService: DataService
	) { }


	closeModal() {
		this.dialogRef.close();
	}

	ngOnInit() {

		// this.findManagerService.getManagerInfo().subscribe(
		// 	(data: any) => {

		// 		if (data.message == 'findManager') {
		// 			this.hasManager = false;
		// 			this.searchBtn = true;

		// 		} else {
		// 			this.hasManager = true;
		// 			this.searchBtn = false;
		// 			console.log(data.getManager);
		// 			this.managerInfo = [data.getManager];
		// 			console.log(this.managerInfo);
		// 			if (this.managerInfo[0].accepted == false) {
		// 				console.log('accepted false');
		// 				this.hasManager = false;
		// 			}
		// 			console.log(this.hasManager);
		// 		}
		// 	},
		// 	err => {
		// 		console.log(err);
		// 		this.dialogService.openDialogNegative(err.error.message);
		// 		// alert(err.error.message);
		// 	}
		// );

		this.dataService.userManagerProfile.subscribe(
			(data: any) => {
				console.log(data)
				this.manager = data;
				if(data){
					this.searchBtn = false;
				}
				else{
					this.searchBtn = true;
				}
			},
			(err: any) => {
				console.log(err);
			}
		)

	}

	findManager() {
		this.manager = null;

		// 소문자로 변환
		this.searchStr = this.searchStr.toLowerCase();

		const sendData = {
			searchStr: this.searchStr,
			company_id: this.data.company_id
		}
		this.findManagerService.findManager(sendData).subscribe(
			(data: any) => {
				this.manager = [data.user];
			},
			err => {
				console.log(err);
				this.dialogService.openDialogNegative(err.error.message);
				// alert(err.error.message);
			}
		);
	}

	addManager() {
		this.dialogService.openDialogConfirm('Do you want to register a manager?').subscribe(result => {
			if (result) {
				this.findManagerService.addManager(this.manager[0]._id).subscribe(
					(data: any) => {
						//alert('팔로우 요청 성공!');

						this.dialogService.openDialogPositive('Successfully, the process has done');
						if (data.message == 'requested') {
						}
						this.dialogRef.close();
					},
					err => {
						console.log(err);
						this.dialogService.openDialogNegative('an Error while adding\nTry again.');
						// alert('an Error while adding\nTry again.');
					}
				);
			}
		});
	}
}

///////////////////////company

@Component({
	selector: 'app-find-company',
	templateUrl: './find-company.html',
	styleUrls: ['./main.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {
	addCodeInput = new FormControl('');
	addCode = ''; // 검색어.
	addBtn: boolean;
	// pendingCompanyReqData;
	// displayedColumns: string[] = ['companyName', 'status'];
	private destroy$ = new Subject<void>();

	constructor(
		public dialogRef: MatDialogRef<CompanyComponent>,
		private companyService: CompanyService,
		private dataService: DataService,
		private dialogService: DialogService
	) { }

	ngOnInit(): void {
		this.companyService.getPendingCompanyRequest().subscribe(
			async (data: any) => {
				// await this.getStorageData();
			},
			(err: any) => {
				console.log(err);
			}
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}


	addingCompany() {
		const company_code = {
			company_code: this.addCode
		}
		this.dialogService.openDialogConfirm('Do you want to register a company?').subscribe(result => {
			if(result){
				this.companyService.addingCompany(company_code).subscribe(
					(data: any) => {
						this.addCodeInput.setValue('');
						this.addCodeInput.disable();
						this.dialogService.openDialogPositive('Successfully, the process has done!');
                        this.dialogRef.close();
					},
					(err: any) => {
						console.log(err);
						if (err.error.message == '4') {
							this.dialogService.openDialogNegative('Already has a pending request.');
							// alert('Already has a pending request.');
						} else if (err.error.message == '5') {
							this.dialogService.openDialogNegative('Wrong code. Try again.')
							// alert('Wrong code. Try again.');
						}
		
						this.addCodeInput.setValue('');
					}
				);
			}
			
		});
	}
}
