import {
	Component,
	Inject,
	inject,
	OnInit,
	ViewChild,
	WritableSignal,
	Input,
	ɵunwrapWritableSignal,
	effect,
} from "@angular/core";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { FormControl, FormsModule } from "@angular/forms";
import { SpacesService } from "../../../services/spaces/spaces.service";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { DialogService } from "../../../stores/dialog/dialog.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaterialsModule } from "../../../materials/materials.module";
import { ScrumboardStorageService } from "../../../stores/scrumboard-storage/scrumboard-storage.service";
import { DocumentsService } from "../../../services/spaces/documents.service";
import { SpaceAddStatusDialogComponent } from "./space-add-status-dialog/space-add-status-dialog.component";
import { ScrumboardSummaryComponent } from "./scrumboard-summary/scrumboard-summary.component";
import { MemberDataStorageService } from "../../../stores/member-data-storage/member-data-storage.service";

export interface ScrumboardList {
	// id: number;
	label: string;
	children: ScrumboardDoc[];
}

export interface ScrumboardDoc {
	visible: boolean;
	color: {};
	createdAt: Date;
	creator: any;
	creator_id: string;
	docContent: [];
	docTitle: string;
	endDate: Date;
	spaceTime_id: string;
	startDate: Date;
	status: string;
	doc_id: string;
	done: boolean;
	labels: any;
}
@Component({
	selector: "app-scrumboard-list",
	standalone: true,
	imports: [CommonModule, MaterialsModule, FormsModule, CdkDropList, CdkDrag],
	templateUrl: "./scrumboard-list.component.html",
	styleUrl: "./scrumboard-list.component.scss",
})
export class ScrumboardListComponent implements OnInit {
	todo = ["Get to work", "Pick up groceries", "Go home", "Fall asleep"];
	done = ["Get up", "Brush teeth", "Take a shower", "Check e-mail", "Walk dog"];

	docStatusList: ScrumboardList[];
	list: ScrumboardList[];
	basicProfile = "/assets/image/person.png";
	spaceMembers: WritableSignal<any> = this.mdsService.member;
	scrum: WritableSignal<any> = this.scrumService.scrum;
	docsArray;

	@Input() spaceInfo: any;
	@Input() memberInSpace: any;

	member = new FormControl();
	temp;
	spaceTime;
	textareaFlag = false;
	createCardFlag;
	panelOpenState = false;
	loginId; // 현재 유저의 아이디

	today: any;
	testCheck = false;

	constructor(
		public dialog: MatDialog,
		private dialogService: DialogService,
		private snackbar: MatSnackBar,
		private router: Router,
		private route: ActivatedRoute,
		private spacesService: SpacesService,
		private scrumService: ScrumboardStorageService,
		private docService: DocumentsService,
		private mdsService: MemberDataStorageService
	) {
		this.list = [];
		effect(() => {
			if (this.scrum()) {
				const data = this.scrum();
				this.temp = data.scrum;
				this.docStatusList = this.temp;
				// this.memberFilter()
				this.ngOnChanges();
			}
		});
	}

	ngOnInit(): void {}

	ngOnChanges(): void {
		if (this.memberInSpace == undefined) {
			return;
		}

		this.spaceTime = this.route.snapshot.params["spaceTime"];
		const checkMemberArray = ["temp"];
		for (let index = 0; index < this.memberInSpace.length; index++) {
			checkMemberArray.push(this.memberInSpace[index]._id);

			if (index == this.memberInSpace.length - 1) {
				this.member.setValue(checkMemberArray);
			}
		}
		this.memberFilter();
	}

	dropList(event: CdkDragDrop<ScrumboardList[]>) {
		const data = {
			_id: this.spaceInfo._id,
			swapPre: event.previousIndex,
			swapCur: event.currentIndex,
		};

		this.docService.scrumEditStatusSequence(data).subscribe(
			(data: any) => {
				// console.log(data);
			},
			(err: any) => {
				// console.log(err);
			}
		);

		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}
		this.snackbar.open("Update list sequence", "Close", {
			duration: 3000,
			horizontalPosition: "center",
		});
		this.textareaFlag = false;
	}

	drop(event: CdkDragDrop<ScrumboardDoc[]>, _: any) {
		const temp = event.previousContainer.data[event.previousIndex];

		const data = {
			_id: temp.doc_id,
			status: event.container.id,
			swapPre: event.previousIndex,
			swapCur: event.currentIndex,
		};
		this.docService.scrumEditDocStatus(data).subscribe(
			(data: any) => {},
			(err: any) => {
				// console.log(err);
			}
		);

		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}

		this.snackbar.open("Update document status", "Close", {
			duration: 3000,
			horizontalPosition: "center",
		});
		this.textareaFlag = false;
	}

	getConnectedList() {
		return this.docStatusList.map((x) => `${x.label}`);
	}

	// status 추가
	addStatus() {
		console.log(this.spaceInfo);
		const dialogRef = this.dialog.open(SpaceAddStatusDialogComponent, {
			data: {
				space_id: this.spaceInfo._id,
				addStatus: "",
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			// result 에 값이 오면 업로드
			if (result) {
				this.docService.scrumAddDocStatus(result).subscribe({
					next: (data: any) => {
						this.initializeScrumBoard(this.member.value);
						this.snackbar.open("Add list", "Close", {
							duration: 3000,
							horizontalPosition: "center",
						});
					},
					error: (err: any) => {},
				});
			}
		});
		this.textareaFlag = false;
	}

	// status 삭제
	deleteStatus(status) {
		this.dialogService
			.openDialogConfirm(
				`If you delete the list, you will also delete the documents in it.\nDo you still want to delete it?`
			)
			.subscribe((result) => {
				if (result) {
					const data = {
						space_id: this.spaceInfo._id,
						label: status.label,
					};
					this.docService.scrumDeleteDocStatus(data).subscribe(
						(data: any) => {
							this.initializeScrumBoard(this.member.value);
							this.snackbar.open("Delete list", "Close", {
								duration: 3000,
								horizontalPosition: "center",
							});
						},
						(err: any) => {}
					);
				}
			});
		this.textareaFlag = false;
	}
	// status 이름 바꾸기
	statusNameChange(value, index, status) {
		const data = {
			spaceId: this.spaceTime,
			changeStatus: value,
			statusIndex: index,
		};

		if (status == value) {
			console.log("안바꼇지롱");
			return;
		}

		this.docService.statusNameChange(data).subscribe(
			(data: any) => {
				this.snackbar.open("Status name change", "Close", {
					duration: 3000,
					horizontalPosition: "center",
				});
				this.initializeScrumBoard(this.member.value);
				this.textareaFlag = false;
			},
			(err: any) => {}
		);
		this.textareaFlag = false;
	}

	openSummary(document, status) {
		console.log(document);
		const dialogRef = this.dialog.open(ScrumboardSummaryComponent, {
			data: {
				document: document,
				space_id: this.spaceInfo._id,
				docStatus: status,
				member: this.spaceInfo.memberObjects,
				labels: this.spaceInfo.labels,
				scrumData: this.docStatusList,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log(result);

			this.initializeScrumBoard(this.member.value);
		});
		this.textareaFlag = false;
	}

	createDoc(status) {
		const editorQuery = {
			spaceTime: this.spaceInfo._id,
			spaceTitle: this.spaceInfo.displayName,
			status: status.label,
		};

		this.router.navigate(["/space/editor/ctDoc"], { queryParams: editorQuery });
		this.textareaFlag = false;
	}

	//park
	//카드 만들기
	createCardAble(status, i) {
		this.createCardFlag = i;
	}

	createCard(status, title) {
		if (title.replace(/\s/g, "").length === 0) {
			this.dialogService.openDialogNegative("Please");
			this.createCardFlag = -1;
			return;
		}

		const docData = {
			spaceTime: this.spaceTime,
			editorTitle: title,
			status: status.label,
			docContent: ``,
			startDate: new Date(),
			endDate: new Date(),
			// memberId: this.selectedMember._id
			memberId: this.loginId,
		};
		this.docService.createDoc(docData).subscribe(
			(data: any) => {
				if (data.message == "created") {
					this.initializeScrumBoard(this.member.value);
					this.createCardFlag = -1;
				}
			},
			(err: any) => {
				console.log(err);
			}
		);
	}
	// 멤버 필터부분
	memberFilter() {
		this.initializeScrumBoard(this.member.value);
	}
	initializeScrumBoard(member?) {
		this.docStatusList = this.temp;

		for (let i = 0; i < this.docStatusList?.length; i++) {
			const children = this.docStatusList[i].children;

			for (let index = 0; index < children.length; index++) {
				const creator = this.docStatusList[i].children[index].creator;

				//이 스페이스의 멤버가 크리에이터안에있으면 화면에 보여줌
				for (let j = 0; j < creator.length; j++) {
					if (member.includes(creator[j]._id)) {
						this.docStatusList[i].children[index].visible = true;
						break;
					} else {
						this.docStatusList[i].children[index].visible = false;
					}
				}
			}
		}
	}

	checkDate(endDate: any) {
		const today = moment(new Date());
		const docDate = moment(new Date(endDate));

		let diff = docDate.startOf("day").diff(today.startOf("day"), "days");
		if (diff === 0) {
			//빨간색
			return { "background-color": "#ed2131", color: "#fff" };
		} else if (diff === 1) {
			return { "background-color": "#ffb412" };
		} else if (diff < 0) {
			return { "background-color": "pink" };
		} else {
			return { "background-color": "black" };
		}
	}

	checkDone(doc: any) {
		if (doc.done !== undefined) {
			const uploadData = {
				doc_id: doc.doc_id,
				done: !doc.done,
			};
			doc.done = !doc.done;
			this.docService.updateDoneEntry(uploadData).subscribe((data: any) => {
				if (data.message == "updated") {
					console.log("Update document check");
				}
			});
		}
	}
	// textarea able flag
	textareaAble() {
		this.textareaFlag = true;
	}
}
