import {
	AfterViewInit,
	Component,
	ElementRef,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
	WritableSignal,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSlider } from "@angular/material/slider";
import { CanvasService } from "../../../../../../services/canvas/canvas.service";
import { Replay } from "../../../../../../services/canvas/recording/replay";
import { DocumentsService } from "../../../../../../services/spaces/documents.service";
import { ProfilesService } from "../../../../../../services/profiles/profiles.service";
import { MaterialsModule } from "../../../../../../materials/materials.module";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-wb-detail",
	templateUrl: "./wb-detail.component.html",
	styleUrls: ["./wb-detail.component.scss"],
	standalone: true,
	imports: [MaterialsModule, DatePipe, FormsModule],
})
export class WbDetailComponent implements OnInit, OnDestroy, AfterViewInit {
	recData;

	// background image를 영상 촬영시 업로드 했을때
	@ViewChild("canvasContainer") public canvasContainerRef: ElementRef;
	@ViewChild("canvasCover") public coverCanvasRef: ElementRef;
	@ViewChild("teacherCanvas") public teacherCanvasRef: ElementRef;
	@ViewChild("cursorCanvas") public cursorCanvasRef: ElementRef;

	@ViewChild(MatSlider) slider: MatSlider;

	canvasContainer: HTMLDivElement;
	coverCanvas: HTMLCanvasElement;
	teacherCanvas: HTMLCanvasElement;
	cursorCanvas: HTMLCanvasElement;

	userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
	hasAudio = true;
	showBg = false; // Question을 배경으로 보여줄지 여부. -> 답변시에 결정됨.

	answer = {
		content: "",
		drawing: null,
		contentType: null,
	};

	public replayModule: Replay;

	currentTime_mSec = 0;
	duration_mSec = 0;
	onSeekFlag: boolean;
	onSeekState: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) private passedData: any,
		public dialogRef: MatDialogRef<WbDetailComponent>,
		private docService: DocumentsService,
		private canvasService: CanvasService,
		private profilesService: ProfilesService
	) {
		// this.docId = this.passedData.docId;
		this.recData = this.passedData.recData;
		console.log(this.recData);
	}

	ngOnInit() {}

	ngOnDestroy() {
		this.replay("stop");
	}

	ngAfterViewInit() {
		this.initCanvasSet();
	}

	initCanvasSet() {
		console.log("여기?");
		this.coverCanvas = this.coverCanvasRef.nativeElement;
		this.teacherCanvas = this.teacherCanvasRef.nativeElement;
		this.cursorCanvas = this.cursorCanvasRef.nativeElement;
		this.canvasContainer = this.canvasContainerRef.nativeElement;

		// console.log('<--- get answer (draw data): ', this.answerData);
		// console.log('questionData =>', this.questionData);
		this.docService.getRecording(this.recData.gstd_key).subscribe({
			next: (data: any) => {
				console.log("gstd", data);
				// showBG
				this.showBg = data.showBg;

				// 답변의 hw ratio 구하기
				const hwRatio = data.canvasSize.h / data.canvasSize.w;
				// calc Zoom Scale
				const zoomScale = this.canvasContainer.clientWidth / data.canvasSize.w;

				// 1. set canvas size
				this.canvasService.setCanvasSize(
					zoomScale,
					hwRatio,
					this.canvasContainer,
					this.coverCanvas,
					this.teacherCanvas,
					this.cursorCanvas
				);
				// 2. init Canvas Drawing
				this.canvasService.drawingInit(
					{
						eraserCanvas: this.cursorCanvas,
						coverCanvas: this.coverCanvas,
						teacherCanvas: this.teacherCanvas,
					},
					this.hasAudio
				);

				// 3. set replay Module
				this.replayModule = this.canvasService.getReplayModule(data);
				console.log("리플레이 모듈", this.replayModule);
				// 4. player의 시간 관련 listener.
				this.replayModule.audioPlayer.addEventListener("timeupdate", () => {
					// ie에서 duration 못받아옴..
					this.duration_mSec = this.replayModule.audioPlayer.duration * 1000;
					this.currentTime_mSec = this.replayModule.audioPlayer.currentTime * 1000;
				});
				// stop -> 처음부터 마지막까지 새로 drawing.
				this.replay("stop");
			},
			error: (error: any) => {
				console.log(error.message);
			},
		});

		// console.log('navigator.userAgent Match', navigator.userAgent.match('Chrome'));
		// console.log('*** userAgent', navigator.userAgent);
	}

	deleteRec() {
		const result = confirm("Do you want to delete this recording file?");
		if (result === false) {
			return;
		} else {
			this.docService.deleteRecording(this.recData).subscribe(
				(data: any) => {
					if (data.message == "deleted") {
						this.dialogRef.close(true);
					}
				},
				(err) => {
					alert(err);
					return;
				}
			);
		}
	}

	onSeekStart() {
		// console.log('onseekstart');
		this.onSeekFlag = true;
		this.onSeekState = this.replayModule.isPlaying;
		if (this.onSeekState) {
			this.replay("pause");
		}
		// this.replayModule.seek(event.value);
	}

	onSeekEnd(event) {
		// console.log('onseekend');
		this.onSeekFlag = false;
		if (this.onSeekState) {
			this.replayModule.seek(event.value);
			this.replay("play");
		} else {
			this.replayModule.seek(event.value);
		}
	}

	// 이동중에 표시할지 여부...
	onSeek(event) {
		// console.log('onseek');
		if (this.onSeekFlag) {
			this.replayModule.onSeek(event.value);
		}
	}

	async onTouched(event) {
		await this.onSeekStart();
		await this.onSeek(event);
		await this.onSeekEnd(event);
	}

	/**
	 * html의 button에 의한 action
	 *
	 * @param action play, pause, stop, forward, backward
	 */
	replay(action) {
		switch (action) {
			case "play":
				this.replayModule.play();
				break;
			case "pause":
				this.replayModule.pause();
				break;
			case "stop":
				this.replayModule.stop();
				break;
			case "forward":
				this.replayModule.forward();
				break;
			case "backward":
				this.replayModule.backward();
				break;
		}
	}
}
