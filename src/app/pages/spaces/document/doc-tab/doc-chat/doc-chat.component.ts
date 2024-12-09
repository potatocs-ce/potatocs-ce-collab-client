import { AfterViewInit, Component, OnInit } from "@angular/core";
import { DocumentsService } from "../../../../../services/spaces/documents.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../../../services/common/common.service";
import { ProfilesService } from "../../../../../services/profiles/profiles.service";
import { ViewChild, ElementRef } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { DialogService } from "../../../../../stores/dialog/dialog.service";
import { MaterialsModule } from "../../../../../materials/materials.module";
@Component({
	selector: "app-doc-chat",
	templateUrl: "./doc-chat.component.html",
	styleUrls: ["./doc-chat.component.scss"],
	standalone: true,
	imports: [MaterialsModule],
})
export class DocChatComponent implements OnInit, AfterViewInit {
	public chatContent;
	public chatDoc = [];
	public paramObject;
	public docId;
	public replyFlag = false;
	public replyContent;
	public replyMember;
	public replyChatId;
	public userId;

	mobileWidth: any;

	@ViewChild("target") private myScrollContainer: ElementRef;
	scrolltop: number = null;

	constructor(
		private docService: DocumentsService,
		// private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private profileService: ProfilesService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		// 유저 아이디 가져오기
		this.profileService.getUserProfile().subscribe((data: any) => {
			// console.log(data);
			this.userId = data.user._id;
		});
		// console.log(this.route.queryParamMap);

		// doc id 가져오기
		this.route.queryParamMap.subscribe((params: any) => {
			this.paramObject = params.params;
			this.docId = this.paramObject.id;
		});
		this.getChatInDoc();
		this.scrollToBottom();
	}

	ngAfterViewInit() {
		this.browserCheck();
	}

	createChat() {
		// this.chatDoc.push(this.chatContent);
		var data = {
			docId: this.docId,
			chatContent: this.chatContent,
			isDialog: true,
		};
		if (this.replyFlag) {
			// console.log(this.replyChatId);
			data["replyChatId"] = this.replyChatId;
		}
		// console.log(data);

		this.docService.createChat(data).subscribe({
			next: (data: any) => {
				// console.log(data);
				this.getChatInDoc();
				this.replyCancel();
				this.chatContent = "";
			},
			error: (err: any) => {
				console.log(err);
			},
		});
	}
	deleteChat(chatId, replyId) {
		// const result = confirm('채팅을 삭제하시겠습니끼?');
		// if(result){

		this.dialogService.openDialogConfirm("Do you want to delete this chat?").subscribe((result) => {
			if (result) {
				const data = {
					chatId: chatId,
					replyId: replyId,
				};
				console.log(data);
				this.docService.deleteChat(data).subscribe(
					(data: any) => {
						// console.log(data);
						this.getChatInDoc();
					},
					(err: any) => {
						console.log(err);
					}
				);
			}
		});
	}

	getChatInDoc() {
		const data = {
			docId: this.docId,
			from: "document",
		};
		this.docService.getChatInDoc(data).subscribe(
			(data: any) => {
				// console.log(data);
				this.chatDoc = data.getChatInDoc;

				for (let index = 0; index < this.chatDoc.length; index++) {
					const date = this.commonService.dateFormatting(this.chatDoc[index].createdAt, "chatDate");
					this.chatDoc[index].createdAt = date;
				}
				console.log(this.chatDoc);
			},
			(err: any) => {
				console.log(err);
			}
		);
	}

	replyChat(item) {
		this.replyFlag = true;
		// console.log(item);
		this.replyContent = item.chatContent;
		this.replyMember = item.chatMember;
		if (item.replyId) {
			this.replyChatId = item.replyId;
		} else {
			this.replyChatId = item._id;
		}
	}
	replyCancel() {
		this.replyFlag = false;
		this.replyContent = "";
		this.replyMember = "";
	}

	scrollToBottom(): void {
		try {
			this.scrolltop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch (err) {}
	}

	// 사파리 fixed 문제
	browserCheck() {
		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			//모바일
			this.mobileWidth = window.screen.width;

			if (this.mobileWidth <= 780) {
				// const maxHEditted_1 = document.querySelector<HTMLElement>('.maxHEditted_1');

				// 채팅부분 ////////////
				document.getElementById("safari1").style.height = "calc(100vh - 330px)";
				document.getElementById("safari2").style.position = "relative";
				document.getElementById("safari2").style.bottom = "0px";
				/////////////////////
			}
		}
	}
}
