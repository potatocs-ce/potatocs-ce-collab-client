import { Component, Inject, inject, OnInit, ViewChild, WritableSignal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SpacesService } from "../../../../services/spaces/spaces.service";
import { DocumentsService } from "../../../../services/spaces/documents.service";
import { CommonService } from "../../../../services/common/common.service";
import { MaterialsModule } from "../../../../materials/materials.module";
import { SideNavService } from "../../../../stores/side-nav/side-nav.service";
import { DialogService } from "../../../../stores/dialog/dialog.service";
import { NavigationService } from "../../../../stores/navigation/navigation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MemberDataStorageService } from "../../../../stores/member-data-storage/member-data-storage.service";

@Component({
	selector: "app-dialog-setting-space",
	standalone: true,
	imports: [MatTabsModule, MatFormFieldModule, FormsModule, MaterialsModule],
	templateUrl: "./dialog-setting-space.component.html",
	styleUrl: "./dialog-setting-space.component.scss",
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

	public navItems;
	private unsubscribe$ = new Subject<void>();

	spaceMembers: WritableSignal<any> = this.mdsService.member;

	constructor(
		public spaceDialogRef: MatDialogRef<DialogSettingSpaceComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sideNavService: SideNavService,
		private spacesService: SpacesService,
		private commonService: CommonService,
		private router: Router,
		private dialogService: DialogService,
		private navigationService: NavigationService,
		private snackbar: MatSnackBar,
		private mdsService: MemberDataStorageService
	) {}
	ngOnInit(): void {
		this.getMembers();
	}

	getMembers() {
		try {
			const data = this.spaceMembers();
			console.log(data);

			if (data.length == 0) {
				this.router.navigate(["collab"]);
			} else {
				this.spaceInfo = {
					_id: data[0]._id,
					displayName: data[0].displayName,
					displayBrief: data[0].displayBrief,
					spaceTime: data[0].spaceTime,
					isAdmin: data[0].isAdmin,
					memberObjects: data[0].memberObjects,
					docStatus: data[0].docStatus,
					labels: data[0].labels,
				};
				console.log(this.spaceInfo);
				this.displayName = this.spaceInfo.displayName;
				this.displayBrief = this.spaceInfo.displayBrief;
				// console.log(this.spaceInfo);
				this.memberInSpace = data[0].memberObjects;
				this.adminInSpace = data[0].admins;

				this.memberInSpace.map((data) => this.commonService.checkArray(data, this.adminInSpace));
			}
		} catch (error) {
			console.error("An error occurred:", error);
			alert("An unexpected error occurred. Please try again later.");
		}
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	onDeleteSpace() {
		console.log("delete");
		// const result = confirm('스페이스를 삭제하면 스페이스 내의 문서, 채팅, 업로드파일, 미팅이 모두 삭제됩니다. 그래도 삭제하시겠습니까?');

		// if (result) {
		this.dialogService
			.openDialogConfirm(
				"If you delete a space, all documents, chat, upload files, and meetings in the space will be deleted. Do you still want to delete it?"
			)
			.subscribe((result) => {
				if (result) {
					this.dialogService.openDialogProgress("Deleting space..");
					const spaceTime = this.spaceInfo.spaceTime;
					this.spacesService.deleteSpace({ spaceTime }).subscribe({
						next: (data: any) => {
							console.log(data);
							// this.collabSideBarComponent.updateSideMenu();
							this.reUpdateSideNav();
							this.router.navigate(["/main"]);
							this.dialogService.closeDialog();
							this.dialogService.openDialogPositive("Successfully,the space has been deleted.");
						},
						error: (err: any) => {
							console.log(err);
						},
					});
				}
			});
	}
	reUpdateSideNav() {
		this.sideNavService.updateSideMenu().subscribe({
			next: (data: any) => {
				console.log(data);
				///////////////
				const space = data.navList[0].spaces;
				this.navItems = this.navigationService.navItems;
				console.log(this.navItems);
				this.navItems[1].children[1].children = [];
				for (let index = 0; index < space.length; index++) {
					const element = {
						type: "link",
						label: space[index].displayName,
						route: "space/" + space[index]._id,
						isManager: false,
						isReplacementDay: false,
					};
					this.navItems[1].children[1].children.push(element);
				}
				///////////////
			},
			error: (err: any) => {
				console.log("sideNavService error", err);
			},
		});
	}

	// displayName ---
	onNameEdit() {
		this.isDisplayName = false;
	}

	onSaveName() {
		const data = {
			id: this.spaceInfo._id,
			displayName: this.displayName,
		};
		this.spacesService.changeSpaceName(data).subscribe({
			next: async (data: any) => {
				console.log(data.message);
				this.isDisplayName = true;
				await this.reUpdateMembers();
				await this.reUpdateSideNav();
				this.snackbar.open("Changed space name", "Close", {
					duration: 3000,
					horizontalPosition: "center",
				});
			},
			error: (err: any) => {
				console.log("spaceService error", err);
			},
		});
	}

	onCancelName() {
		this.isDisplayName = true;
		this.displayName = this.spaceInfo.displayName;
	}

	// displayBrief ---
	onBriefEdit() {
		this.isDisplayBrief = false;
	}

	onSaveBrief() {
		const data = {
			id: this.spaceInfo._id,
			displayBrief: this.displayBrief,
		};
		this.spacesService.changeSpaceBrief(data).subscribe(
			async (data: any) => {
				console.log(data.message);
				this.isDisplayBrief = true;
				await this.reUpdateMembers();
				await this.reUpdateSideNav();
				this.snackbar.open("Changed space brief", "Close", {
					duration: 3000,
					horizontalPosition: "center",
				});
			},
			(err: any) => {
				console.log("spaceService error", err);
			}
		);
	}

	onCancelBrief() {
		this.isDisplayBrief = true;
		this.displayBrief = this.spaceInfo.displayBrief;
	}

	// 관리자 해제
	quitAdmin(member_id) {
		const data = {
			id: this.spaceInfo._id,
			member_id: member_id,
		};
		// 관리자가 1명일때는 해제 못함
		if (this.adminInSpace.length == 1) {
			this.dialogService.openDialogNegative("Need at least one space administrator");
			// alert("Need at least one space administrator")
		} else {
			this.spacesService.quitSpaceAdmin(data).subscribe(
				async (data: any) => {
					await this.reUpdateMembers();
					this.snackbar.open("Quit space admin", "Close", {
						duration: 3000,
						horizontalPosition: "center",
					});
				},
				(err: any) => {
					console.log("spaceService error", err);
				}
			);
		}
	}

	// 관리자 선정
	addAdmin(member_id) {
		const data = {
			id: this.spaceInfo._id,
			member_id: member_id,
		};
		this.spacesService.addSpaceAdmin(data).subscribe(async (data: any) => {
			await this.reUpdateMembers();
			this.snackbar.open("Add new space admin", "Close", {
				duration: 3000,
				horizontalPosition: "center",
			});
		});
	}

	// 멤버 탈퇴
	deleteMember(member_id) {
		// const result = confirm('Do you want to release a member?');
		// if (result) {
		this.dialogService.openDialogConfirm("Do you want to withdraw the member?").subscribe((result) => {
			if (result) {
				const data = {
					id: this.spaceInfo._id,
					member_id: member_id,
				};
				this.spacesService.deleteSpaceMember(data).subscribe(async (data: any) => {
					console.log(data.message);
					await this.reUpdateMembers();
					this.snackbar.open("Withdraw from the space", "Close", {
						duration: 3000,
						horizontalPosition: "center",
					});
				});
			}
		});
	}

	reUpdateMembers() {
		console.log(this.spaceInfo.spaceTime);
		this.spacesService.getSpaceMembers(this.spaceInfo.spaceTime).subscribe(
			(data: any) => {
				console.log(data);
			},
			(err: any) => {
				console.log("spaceService error", err);
			}
		);
	}
}
