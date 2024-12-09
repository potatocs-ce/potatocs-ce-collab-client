import { Component, Input, OnInit, Signal, ViewChild, WritableSignal, effect } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DocDataStorageService } from "../../../stores/doc-data-storage.service";
import { CommonService } from "../../../services/common/common.service";
import { DialogSpaceMemberComponent } from "../dialogs/dialog-space-member/dialog-space-member.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PeriodicElement } from "../document/doc-tab/doc-file-upload/doc-file-upload.component";
import { MatSort } from "@angular/material/sort";
import { DialogService } from "../../../stores/dialog/dialog.service";
import { MaterialsModule } from "../../../materials/materials.module";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-doc-list",
	templateUrl: "./doc-list.component.html",
	styleUrls: ["./doc-list.component.scss"],
	standalone: true,
	imports: [MaterialsModule, CommonModule],
})
export class DocListComponent implements OnInit {
	length = 50;
	pageSize = 10;
	pageIndex = 0;
	pageSizeOptions = [5, 10, 15];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@Input() spaceInfo: any;
	@Input() spaceTime: any;
	private unsubscribe$ = new Subject<void>();
	docs: Signal<any> = this.ddsService.docs;
	files: WritableSignal<any> = this.ddsService.files;
	// public spaceTime: String;
	public docsArray: any;
	displayedColumns: string[] = ["status", "period", "docTitle", "creator", "createdAt"];
	constructor(
		private route: ActivatedRoute,
		private ddsService: DocDataStorageService,
		private router: Router,
		public dialog: MatDialog,
		private dialogService: DialogService,
		private CommonService: CommonService
	) {
		effect(() => {
			console.log(this.docs());
			if (this.docs()) {
				this.docsArray = this.docs();
				this.length = this.docsArray.length;
				this.docsArray = new MatTableDataSource<PeriodicElement>(this.docs());
				this.docsArray.paginator = this.paginator;
				this.docsArray.sort = this.sort;
			}
		});
	}

	ngOnInit(): void {
		if (this.docs()) {
			this.docsArray = this.docs();

			this.length = this.docsArray.length;
			this.docsArray = new MatTableDataSource<PeriodicElement>(this.docs());
			this.docsArray.paginator = this.paginator;
		}
	}

	ngAfterViewInit() {}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	openDoc(docId) {
		const docQuery = {
			id: docId,
		};
		console.log(docQuery);
		const spaceId = this.spaceTime;
		this.spaceTime = "";
		this.router.navigate(["space/" + spaceId + "/doc"], { queryParams: docQuery });
	}

	sharingDocumentBtn() {
		const editorQuery = {
			spaceTime: this.spaceTime,
			spaceTitle: this.spaceInfo.displayName,
		};
		console.log(this.spaceInfo.docStatus);
		if (this.spaceInfo.docStatus.length < 1) {
			this.dialogService.openDialogNegative("Status does not exist.");
		} else {
			this.router.navigate(["collab/editor/ctDoc"], { queryParams: editorQuery });
		}
	}

	inviteMemberBtn(): void {
		console.log("openSpaceMemeber");
		const dialogRef = this.dialog.open(DialogSpaceMemberComponent, {
			width: "600px",
			height: "300px",
			data: {
				spaceTime: this.spaceTime,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("The dialog setting was closed");
			// this.getMembers();
			// if (result == null || result == '') {

			// } else {

			// }
		});
	}
}
