import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { DocumentsService } from "../../../../../services/spaces/documents.service";
import { WbDetailComponent } from "./wb-detail/wb-detail.component";
import { WbDialogComponent } from "./wb-dialog/wb-dialog.component";
import { saveAs } from "file-saver";
import { MaterialsModule } from "../../../../../materials/materials.module";

export interface RecElement {
	creator: Object;
	docId: String;
	fileName: String;
	key: String;
	recordingTitle: String;
}

@Component({
	selector: "app-white-board",
	templateUrl: "./white-board.component.html",
	styleUrls: ["./white-board.component.scss"],
	standalone: true,
	imports: [MaterialsModule],
})
export class WhiteBoardComponent implements OnInit {
	spaceTime: any;
	getRecList: any;
	displayedColumns: string[] = ["title", "uploader", "download"];
	@ViewChild(MatPaginator) paginator: MatPaginator;

	@Input() docId: string;
	constructor(private route: ActivatedRoute, private dialog: MatDialog, private documentService: DocumentsService) {}

	ngOnInit(): void {
		this.spaceTime = this.route.snapshot.params["spaceTime"];

		this.getWhiteBoardRecList(this.docId);
	}

	openAnswerModal(type) {
		switch (type) {
			// case 'image':
			// 	console.log('answer: image');
			// 	const imageDialogRef = this.dialog.open(ImageAnswerModalComponent, {
			// 		width: '800px',
			// 		data: { questionId: this.questionId },
			// 		disableClose: true // 모달창 바깥을 눌러도 안닫힘..
			// 	});
			// 	imageDialogRef.afterClosed().subscribe(
			// 		result => {
			// 			if (result) {
			// 				alert(this.QNA.SUCCESS.ANSWERED);
			// 				this.getQuestionDetail();
			// 			}
			// 		}
			// 	);
			// 	break;
			case "recording":
				console.log("answer: recording");
				const recordingDialogRef = this.dialog.open(WbDialogComponent, {
					width: "800px",
					data: { docId: this.docId },
					disableClose: true,
				});
				recordingDialogRef.afterClosed().subscribe((result) => {
					if (result) {
						alert("Successfully, saved");
						this.getWhiteBoardRecList(this.docId);
					}
				});
				break;
			default:
				alert("Error. Try again.");
				break;
		}
	}

	getWhiteBoardRecList(docId) {
		this.documentService.getWhiteBoardRecList(docId).subscribe(
			(data: any) => {
				// console.log('docService return Data =>', data);
				if (data.message == "loaded") {
					this.getRecList = data.recList;
					this.getRecList = new MatTableDataSource<RecElement>(this.getRecList);
					this.getRecList.paginator = this.paginator;
				}
				// console.log('REC LIST', this.getRecList);
			},
			(err) => {
				console.log("docService Error to get a record list", err);
			}
		);
	}

	openRecDetail(recData) {
		console.log("레코딩데이터", recData);
		const dialogRef = this.dialog.open(WbDetailComponent, {
			width: "800px",
			data: {
				recData: recData,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("dialog closed", result);

			if (result == true) {
				alert("Successfully, deleted");
				this.getWhiteBoardRecList(this.docId);
			}
		});
	}

	downloadRecording(recData) {
		this.documentService.downloadRecording(recData).subscribe((res: any) => {
			const blob = res;
			saveAs(blob, recData.recordingTitle);
		});
	}
}
