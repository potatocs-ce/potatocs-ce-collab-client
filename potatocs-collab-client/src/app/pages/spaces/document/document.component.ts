import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

// EDITOR START
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";

// EDITOR END
import { DocumentsService } from "../../../services/spaces/documents.service";

import { DialogService } from "../../../stores/dialog/dialog.service";
import { SpacesService } from "../../../services/spaces/spaces.service";
import { fromEvent, Observable, Subject, Subscription } from "rxjs";

import { EventData } from "../../../services/eventBus/event.class";
import { EventBusService } from "../../../services/eventBus/event-bus.service";
import { MaterialsModule } from "../../../materials/materials.module";
import { DocChatComponent } from "./doc-tab/doc-chat/doc-chat.component";
import { DocFileUploadComponent } from "./doc-tab/doc-file-upload/doc-file-upload.component";
// import { WhiteBoardComponent } from "./doc-tab/white-board/white-board.component";
@Component({
	selector: "app-document",
	templateUrl: "./document.component.html",
	styleUrls: ["./document.component.scss"],
	standalone: true,
	imports: [MaterialsModule, DocChatComponent, DocFileUploadComponent],
})
export class DocumentComponent implements OnInit, AfterViewInit {
	@ViewChild("innderContainer")
	innderContainer: ElementRef;

	spaceTime: any;
	spaceTitle: String;
	editor: any;
	editorTitle: String;
	selectedStatus: any;
	docContent: any;
	paramObject: any;
	docId: any;
	isSpaceAdmin: boolean;

	mobileWidth: any;

	private unsubscribe$ = new Subject<void>();

	// 브라우저 크기 변화 체크 ///
	resizeObservable$: Observable<Event>;
	resizeSubscription$: Subscription;
	///////////////////////

	rightBlockDisplay = false;
	matIcon = "arrow_back_ios";
	toggle = false;

	// docStatus
	docStatus;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private docService: DocumentsService,
		private dialogService: DialogService,
		private spaceService: SpacesService,
		private eventBusService: EventBusService,
		private snackbar: MatSnackBar
	) {
		this.spaceTime = this.route.snapshot.params["spaceTime"];

		this.route.queryParamMap.subscribe((params: any) => {
			this.paramObject = params.params;
			this.docId = this.paramObject.id;
		});
	}

	////////////////////////////////////
	// 브라우저 크기
	@HostListener("window:resize", ["$event"])
	onResize(event) {
		this.mobileWidth = event.target.innerWidth;
	}
	////////////////////////////////////

	ngOnInit(): void {
		this.mobileWidth = window.screen.width;

		this.spaceService.getSpaceMembers(this.spaceTime).subscribe({
			next: (data: any) => {
				// console.log(data.spaceMembers[0].docStatus);
				this.docStatus = data.spaceMembers[0].docStatus;
			},
			error: (err: any) => {},
		});
		this.getInfo();

		////////////////////////////////////
		// 브라우저 크기 변화 체크
		this.resizeObservable$ = fromEvent(window, "resize");
		this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
			// console.log('event: ', evt)
		});
		////////////////////////////////////

		this.eventBusService.on("viewMore", this.unsubscribe$, () => {
			if (this.toggle == false) {
				this.toggle = true;
			} else {
				this.toggle = false;
			}
		});
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.resizeSubscription$.unsubscribe();
	}

	ngAfterViewInit() {
		// console.log(window.innerHeight);
	}

	updateDoc() {
		// const result = confirm('Do you want to save the modified version?');
		// if (result) {

		this.dialogService.openDialogConfirm("Do you want to save?").subscribe((result) => {
			if (result) {
				this.editor
					.save()
					.then((outputData) => {
						const updateDocData = {
							_id: this.docId,
							status: this.selectedStatus,
							docTitle: this.editorTitle,
							docContent: outputData,
						};

						this.docService.updateDoc(updateDocData).subscribe(
							(data: any) => {
								if (data.message == "updated") {
									this.snackbar.open("Successfully document saved", "Close", {
										duration: 3000,
										horizontalPosition: "center",
									});
									// this.dialogService.openDialogPositive('succeed document save!');
									// this.router.navigate(['/collab/space/' + this.spaceTime]);
								}
							},
							(err: any) => {
								console.log(err);
							}
						);
					})
					.catch((error) => {
						console.log("getting a content data has failed: ", error);
					});
			}
		});
	}

	docUpdate(updateDocData) {}

	toBack(): void {
		this.dialogService.openDialogConfirm("Unsaved data disappears. Do you want to go back?").subscribe((result) => {
			if (result) {
				const spaceId = this.spaceTime;
				this.spaceTime = "";
				this.router.navigate(["/collab/space/" + spaceId]);
			}
		});
	}

	getInfo(): void {
		console.log(this.docId);
		this.docService.getInfo(this.docId).subscribe({
			next: (data: any) => {
				this.spaceTitle = data.docInfo.displayName;
				this.selectedStatus = data.docInfo.status;
				this.editorTitle = data.docInfo.docTitle;
				this.docContent = data.docInfo.docContent[0];
				this.renderEditor(this.docContent);
				this.isSpaceAdmin = data.docInfo.isSpaceAdmin;
			},
		});
	}

	deleteDoc() {
		// const result = confirm('문서에 업로드 된 파일도 모두 삭제됩니다. 그래도 삭제하시겠습니까?');

		// if (result) {

		this.dialogService
			.openDialogConfirm(
				"All files uploaded to the document will also be deleted. Do you still want to delete this document?"
			)
			.subscribe((result) => {
				if (result) {
					const docId = this.docId;
					this.docService.deleteDoc({ docId }).subscribe({
						next: (data: any) => {
							this.router.navigate(["/collab/space/" + this.spaceTime]);
							this.dialogService.openDialogPositive("Successfully,the document has been deleted.");
						},
						error: (err: any) => {
							console.log(err);
						},
					});
				}
				// else {
				// 	console.log('문서 삭제 취소')
				// }
			});
	}

	renderEditor(editorData): void {
		this.editor = new EditorJS({
			autofocus: true,
			/**
			 * Id of Element that should contain the Editor
			 */
			holder: "editorjs",

			/**
			 * Available Tools list.
			 * Pass Tool's class or Settings object for each Tool you want to use
			 */
			tools: {
				header: {
					class: Header,
					inlineToolbar: true,
					config: {
						placeholder: "Enter a header",
						levels: [2, 3, 4, 5, 6],
						defaultLevel: 3,
					},
				},
				list: {
					class: List,
					inlineToolbar: true,
				},
				image: SimpleImage,
				quote: {
					class: Quote,
					inlineToolbar: true,
				},
				inlineCode: {
					class: InlineCode,
					inlineToolbar: true,
				},
				marker: {
					class: Marker,
					inlineToolbar: true,
				},
				table: {
					class: Table,
					inlineToolbar: true,
				},
				delimiter: Delimiter,
			},
			data: editorData,
		});
	}

	rightBlockDisplayBtn() {
		if (this.rightBlockDisplay == false) {
			this.rightBlockDisplay = true;
			this.matIcon = "arrow_forward_ios";
		} else {
			this.rightBlockDisplay = false;
			this.matIcon = "arrow_back_ios";
		}
	}

	viewMore() {
		this.eventBusService.emit(new EventData("viewMore", ""));
	}
}
