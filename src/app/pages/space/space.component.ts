import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { SpaceService } from 'src/@dw/services/collab/space/space.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { SideNavService } from 'src/@dw/services/collab/side-nav/side-nav-service.service';
import { MatTable } from '@angular/material/table';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { SpaceListStorageService } from '../../../@dw/store/space-list-storage.service';
import { NavigationService } from 'src/@dw/services/navigation.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';

//auto complete
// import { FormControl } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
// export interface members {
// 	_id: string;
// 	name: string;
// 	email: string;
// }


@Component({
	selector: 'app-space',
	templateUrl: './space.component.html',
	styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {

	basicProfile = '/assets/image/person.png';
	public spaceInfo;
	public memberInSpace;
	public adminInSpace;
	public spaceTime: string;
	private unsubscribe$ = new Subject<void>();
	
	constructor(
		public dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private spaceService: SpaceService,
		private mdsService: MemberDataStorageService,
		private commonService: CommonService,
		private dialogService: DialogService,
		private docService: DocumentService,

	) {
		
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.spaceTime = this.route.snapshot.params.spaceTime;

			console.log(params);
			this.spaceService.getSpaceMembers(params.spaceTime).subscribe(
				async (data: any) => {
					await this.getMembers();
				},
				(err: any) => {
					console.log('spaceService error', err);
				});
			
				this.docService.getMeetingList({spaceId: this.spaceTime}).subscribe(
					(data: any) => {
						console.log(data);
					},
					(err: any) => {
						console.log(err);
					},
				);
		});
	}
	

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
	

	getMembers() {
		// console.log('getMembers');
		this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
			async (data: any) => {
				console.log(data, data[0].docStatus);
				if (data.length == 0) {
					this.router.navigate(['collab']);
				}
				else {
					this.spaceInfo = {
						_id: data[0]._id,
						displayName: data[0].displayName,
						displayBrief: data[0].displayBrief,
						spaceTime: data[0].spaceTime,
						isAdmin: data[0].isAdmin,
						memberObjects: data[0].memberObjects,
						docStatus:data[0].docStatus,


                        labels: data[0].labels
					}
					// console.log(this.spaceInfo);
					this.memberInSpace = data[0].memberObjects;
					this.adminInSpace = data[0].admins;

					await this.memberInSpace.map(data => this.commonService.checkArray(data, this.adminInSpace));
				}
			},
			(err: any) => {
				console.log('mdsService error', err);

			}
		)
	}

	// createDoc() {
	// 	const editorQuery = {
	// 		spaceTime: this.spaceTime,
	// 		spaceTitle: this.spaceInfo.displayName,
	// 	}

	// 	this.router.navigate(['collab/editor/ctDoc'], { queryParams: editorQuery });
	// }

	checkArray(data, arrayData) {
		const isInArray = arrayData.includes(data._id);
		if (isInArray) {
			return data.isAdmin = true;
		} else {
			return data.IsAdmin = false;
		}
	}

	openSpaceOption(): void {
		const dialogRef = this.dialog.open(DialogSettingSpaceComponent, {
			// width: '600px',
			// height: '500px',
			data: {
				spaceInfo: this.spaceInfo,
				memberInSpace: this.memberInSpace
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog setting was closed');
			if (result == null || result == '') {

			} else {

			}
		});
	}
	openSpaceMemeber(): void {
		console.log('openSpaceMemeber this.spaceTime : ', this.spaceTime);
		const dialogRef = this.dialog.open(DialogSpaceMemberComponent, {
			width: '600px',
			height: '300px',
			data: {
				spaceTime: this.spaceTime,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog setting was closed');
			this.getMembers();
			if (result == null || result == '') {

			} else {

			}
		});
	}


}


// 스페이스 세팅 모달
@Component({
	selector: 'dialog-setting-space',
	templateUrl: './dialogs/dialog-setting-space.component.html',
	styleUrls: ['./dialogs/dialog-setting-space.component.scss']
})
export class DialogSettingSpaceComponent implements OnInit {

	public isDisplayName = true;
	public isDisplayBrief = true;
	public spaceTime;

	public displayName: string;
	public displayBrief: string;
	public spaceId: string;
	public memberInSpace;
	public adminInSpace;
	public spaceInfo;

	public navItems
	private unsubscribe$ = new Subject<void>();

	constructor(
		private route: ActivatedRoute,
		public spaceDialogRef: MatDialogRef<DialogSettingSpaceComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sideNavService: SideNavService,
		private spaceService: SpaceService,
		private mdsService: MemberDataStorageService,
		private commonService: CommonService,
		private router: Router,
		private dialogService: DialogService,
		private spaceListStorageService: SpaceListStorageService,
		private navigationService: NavigationService,
		private snackbar: MatSnackBar,
	) {

	}

	ngOnInit(): void {
		this.getMembers();
	}
	

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	
	  }
	

	getMembers() {
		this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
			async (data: any) => {
				console.log(data);
				this.spaceInfo = {
					_id: data[0]._id,
					displayName: data[0].displayName,
					displayBrief: data[0].displayBrief,
					spaceTime: data[0].spaceTime,
					isAdmin: data[0].isAdmin
				}
				this.displayName = data[0].displayName,
				this.displayBrief = data[0].displayBrief,
				this.memberInSpace = data[0].memberObjects;
				this.adminInSpace = data[0].admins;

				await this.memberInSpace.map(data => this.commonService.checkArray(data, this.adminInSpace));

			},
			(err: any) => {
				console.log('mdsService error', err);
			}
		)
	}

	onDeleteSpace() {
		console.log('delete');
		// const result = confirm('스페이스를 삭제하면 스페이스 내의 문서, 채팅, 업로드파일, 미팅이 모두 삭제됩니다. 그래도 삭제하시겠습니까?');

		// if (result) {
		this.dialogService.openDialogConfirm('If you delete a space, all documents, chat, upload files, and meetings in the space will be deleted. Do you still want to delete it?').subscribe(result => {
			if (result) {
				this.dialogService.openDialogProgress('Deleting space..');
				const spaceTime = this.spaceInfo.spaceTime;
				this.spaceService.deleteSpace({ spaceTime }).subscribe(
					(data: any) => {
						console.log(data);
						// this.collabSideBarComponent.updateSideMenu();
						this.reUpdateSideNav();
						this.router.navigate(['/main']);
						this.dialogService.closeDialog();
						this.dialogService.openDialogPositive('Successfully,the space has been deleted.');
					},
					(err: any) => {
						console.log(err);
					}
				)
			}
		});
	}

	// displayName ---
	onNameEdit() {
		this.isDisplayName = false;
	}

	onSaveName() {
		const data = {
			id: this.spaceInfo._id,
			displayName: this.displayName
		}
		this.spaceService.changeSpaceName(data).subscribe(
			async (data: any) => {
				console.log(data.message);
				this.isDisplayName = true;
				await this.reUpdateMembers();
				await this.reUpdateSideNav();
				this.snackbar.open('Changed space name','Close' ,{
					duration: 3000,
					horizontalPosition: "center"
				});
			},
			(err: any) => {
				console.log('spaceService error', err);
			}
		);

	}

	onCancelName() {
		this.isDisplayName = true;
		this.displayName = this.spaceInfo.displayName;
	}
	// displayName ---

	// displayBrief ---
	onBriefEdit() {
		this.isDisplayBrief = false;
	}

	onSaveBrief() {
		const data = {
			id: this.spaceInfo._id,
			displayBrief: this.displayBrief
		}
		this.spaceService.changeSpaceBrief(data).subscribe(
			async (data: any) => {
				console.log(data.message);
				this.isDisplayBrief = true;
				await this.reUpdateMembers();
				await this.reUpdateSideNav();
				this.snackbar.open('Changed space brief','Close' ,{
					duration: 3000,
					horizontalPosition: "center"
				});
			},
			(err: any) => {
				console.log('spaceService error', err);
			}
		);
	}

	onCancelBrief() {
		this.isDisplayBrief = true;
		this.displayBrief = this.spaceInfo.displayBrief;
	}
	// displayBrief ---



	// 관리자 해제
	quitAdmin(member_id) {
		const data = {
			id: this.spaceInfo._id,
			member_id: member_id
		}
		// 관리자가 1명일때는 해제 못함
		if (this.adminInSpace.length == 1) {
			this.dialogService.openDialogNegative("Need at least one space administrator")
			// alert("Need at least one space administrator")
		}
		else {
			this.spaceService.quitSpaceAdmin(data).subscribe(
				async (data: any) => {
					await this.reUpdateMembers();
					this.snackbar.open('Quit space admin','Close' ,{
						duration: 3000,
						horizontalPosition: "center"
					});
				},
				(err: any) => {
					console.log('spaceService error', err);
				}
			)
		}
	}

	// 관리자 선정
	addAdmin(member_id) {
		const data = {
			id: this.spaceInfo._id,
			member_id: member_id
		}
		this.spaceService.addSpaceAdmin(data).subscribe(
			async (data: any) => {
				await this.reUpdateMembers();
				this.snackbar.open('Add new space admin','Close' ,{
					duration: 3000,
					horizontalPosition: "center"
				});
			}
		)
	}

	// 멤버 탈퇴
	deleteMember(member_id) {
		// const result = confirm('Do you want to release a member?');
		// if (result) {
		this.dialogService.openDialogConfirm('Do you want to withdraw the member?').subscribe(result => {
			if (result) {
				const data = {
					id: this.spaceInfo._id,
					member_id: member_id
				}
				this.spaceService.deleteSpaceMember(data).subscribe(
					async (data: any) => {
						console.log(data.message);
						await this.reUpdateMembers();
						this.snackbar.open('Withdraw from the space','Close' ,{
							duration: 3000,
							horizontalPosition: "center"
						});
					}
				)
			}
		});
	}


	reUpdateMembers() {
		console.log(this.spaceInfo.spaceTime);
		this.spaceService.getSpaceMembers(this.spaceInfo.spaceTime).subscribe(
			(data: any) => {
				console.log(data)
			},
			(err: any) => {
				console.log('spaceService error', err);
			}
		);
	}

	reUpdateSideNav() {
		this.sideNavService.updateSideMenu().subscribe(
			(data: any) => {
				console.log(data);
				///////////////
				const space = data.navList[0].spaces

				this.navItems = this.navigationService.items;
		
				this.navItems[1].children[1].children = [];
				for (let index = 0; index < space.length; index++) {
				  const element = {
					type: 'link',
					label: space[index].displayName,
					route: 'collab/space/' + space[index]._id,
					isManager: false,
					isReplacementDay: false,
				  }
				  this.navItems[1].children[1].children.push(element);
				}
				this.spaceListStorageService.updateSpaceList(this.navItems);
				///////////////


				const sideNavLists = {
					folder_list: data.navList[0].folders,
					space_list: data.navList[0].spaces
				}
				console.log(sideNavLists);
				this.sideNavService.setTrueForSideNavFlag();
				this.sideNavService.updateMenuData(sideNavLists);
			},
			(err: any) => {
				console.log('sideNavService error', err);
			}
		);
	}



}
// 스페이스에 멤버추가하는 모달
@Component({
	selector: 'dialog-space-member',
	templateUrl: './dialogs/dialog-space-member.component.html',
	styleUrls: ['./dialogs/dialog-setting-space.component.scss']
})
export class DialogSpaceMemberComponent implements OnInit {

	// myControl = new FormControl();
	// options: members[];
	// filteredOptions: Observable<members[]>;
	searchEmail
	displaymemberInfo
	memberInfo = [];
	spaceTime
	displayedColumns: string[] = ['name', 'email', 'invite'];
	constructor(
		private spaceService: SpaceService,
		private route: ActivatedRoute,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogService: DialogService,
		private snackbar: MatSnackBar,
	) { }

	ngOnInit() {
		this.spaceTime = this.data.spaceTime;
		console.log(this.spaceTime);
		// this.getAllMemeber();
		// console.log(this.myControl);
		// console.log(this.options);

	}

	searchSpaceMember() {
		const email = this.searchEmail;
		this.spaceService.searchSpaceMember({ email }).subscribe(
			(data: any) => {
				console.log(data);
				if (data.message == `retired spaceMember`) {
					this.dialogService.openDialogNegative(`An employee who's retired at the company.`);
					// alert(`It's a member that doesn't exist.\nPlease check email`);
				} else if (data.searchSpaceMember == null) {
					this.dialogService.openDialogNegative(`It's a member that doesn't exist.\nPlease check email`);
					// alert(`It's a member that doesn't exist.\nPlease check email`);
				}
				else {
					this.memberInfo = [data.searchSpaceMember];
					this.displaymemberInfo = this.memberInfo;
					console.log(this.memberInfo)
					console.log(this.displaymemberInfo);
				}
			},
			(err: any) => {
				console.log(err);
			}
		)
	}

	inviteSpaceMember(member) {
		// const result = confirm(`Do you want to invite?`);
		// if (result) {
		this.dialogService.openDialogConfirm(`Do you want to invite the member?`).subscribe(result => {
			if (result) {
				// console.log(member._id);
				// console.log('inviteSpaceMember');
				const data = {
					member_id: member._id,
					spaceTime: this.spaceTime
				}
				// console.log(data);
				this.spaceService.inviteSpaceMember(data).subscribe(
					(data: any) => {
						// console.log(data);
						// this.dialogService.openDialogPositive('Successfully, the member has invited.');
						this.snackbar.open('Successfully, the member has invited.','Close' ,{
							duration: 3000,
							horizontalPosition: "center"
						});
						// alert('Successfully, invited.');
						this.displaymemberInfo = '';
						// this.searchEmail = '';
						this.reUpdateMembers();
					},
					(err: any) => {
						// console.log(err);
						this.displaymemberInfo = '';
						// this.searchEmail = '';
						this.dialogService.openDialogNegative(err.error.message);
					}
				)
			}
		});
	}
	// clearMember(){
	// 	this.displaymemberInfo =[];
	// }

	reUpdateMembers() {
		console.log(this.spaceTime);
		this.spaceService.getSpaceMembers(this.spaceTime).subscribe(
			(data: any) => {
				console.log(data)
			},
			(err: any) => {
				console.log('spaceService error', err);
			}
		);
	}



}


