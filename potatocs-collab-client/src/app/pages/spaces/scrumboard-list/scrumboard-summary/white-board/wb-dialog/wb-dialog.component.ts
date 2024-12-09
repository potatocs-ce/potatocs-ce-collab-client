import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CANVAS_CONFIG, DRAWING_TYPE } from "../../../../../../services/canvas/canvas-config/canvas-config";
import { CanvasService } from "../../../../../../services/canvas/canvas.service";
import { DocumentsService } from "../../../../../../services/spaces/documents.service";
import { MaterialsModule } from "../../../../../../materials/materials.module";
import { CommonModule } from "@angular/common";

type RecordType = {
    recordingTitle: string;
    drawing: any;
    contentType: number;
    picture: any;
};

@Component({
    selector: "app-wb-dialog",
    templateUrl: "./wb-dialog.component.html",
    styleUrls: ["./wb-dialog.component.scss"],
    standalone: true,
    imports: [MaterialsModule, CommonModule],
})
export class WbDialogComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild("canvasContainer") public canvasContainerRef: ElementRef;
    @ViewChild("canvasCover") public coverCanvasRef: ElementRef;
    @ViewChild("teacherCanvas") public teacherCanvasRef: ElementRef;
    @ViewChild("cursorCanvas") public cursorCanvasRef: ElementRef;

    canvasContainer: HTMLDivElement;
    coverCanvas: HTMLCanvasElement;
    teacherCanvas: HTMLCanvasElement;
    cursorCanvas: HTMLCanvasElement;

    hasAudio = true;
    showBg = false;
    isRecording: boolean;
    imgPreview: any;
    imgFiles: File[];

    docId: any;
    record: RecordType = {
        recordingTitle: "",
        drawing: 0,
        contentType: 0,
        picture: 0,
    };

    /************
     * Timer
     *************/
    time = 0;
    interval: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) private passedData: any,
        public dialogRef: MatDialogRef<WbDialogComponent>,
        private canvasService: CanvasService,
        private docService: DocumentsService
    ) {
        this.docId = this.passedData.docId;
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.initCanvasSet();
    }

    ngOnDestroy() {
        this.canvasService.releaseEventHandler();
    }

    resetFileInput(event: MouseEvent): void {
        const input = event.target as HTMLInputElement;
        input.value = null; // Clear the input
    }

    initCanvasSet() {
        this.coverCanvas = this.coverCanvasRef.nativeElement;
        this.teacherCanvas = this.teacherCanvasRef.nativeElement;
        this.cursorCanvas = this.cursorCanvasRef.nativeElement;
        this.canvasContainer = this.canvasContainerRef.nativeElement;

        // set CanvasSize
        const hwRatio = 4 / 3; // 일단 8:6 비율...

        // calc Zoom Scale
        const zoomScale = 1;

        // 1. set canvas size
        this.canvasService.setCanvasSize(
            zoomScale,
            hwRatio,
            this.canvasContainer,
            this.coverCanvas,
            this.teacherCanvas,
            this.cursorCanvas
        );

        // 2. canvas Drawing Init.
        this.canvasService.drawingInit(
            { eraserCanvas: this.cursorCanvas, coverCanvas: this.coverCanvas, teacherCanvas: this.teacherCanvas },
            this.hasAudio
        );
        // 3. event handler 등록
        this.canvasService.addEventHandler();
    }

    async recordingStart() {
        this.isRecording = true;
        alert("Recording has started");
        console.log("녹화시작: isrecording: ", this.isRecording);
        this.canvasService.recordingStart();

        /**************************
         * Timer
         ***************************/
        this.timer();
    }

    async recordingStop() {
        /**************************
         * Timer
         ***************************/
        clearInterval(this.interval);

        this.isRecording = false;
        alert("Recording has stopped");
        console.log("녹화종료: isrecording: ", this.isRecording);
        this.record.drawing = await this.canvasService.recordingStop();
    }

    /**************************
     * Timer
     ***************************/
    timer() {
        this.interval = setInterval(() => {
            if (this.time < 1000) {
                this.time += 1;
            } else {
                this.time = 0;
                clearInterval(this.interval);
                this.recordingStop();
            }
        }, 1000);
    }

    /**
     *
     * 답변 등록
     *
     */
    async registerAnswer(f: NgForm) {
        if (this.isRecording) {
            alert("You must stop recording first.");
            return;
        }

        // console.log('this.answer.drawing: ', this.record.drawing);

        // background 여부 추가
        this.record.drawing.showBg = this.showBg;

        // canvas Size 추가
        this.record.drawing.canvasSize = { w: this.coverCanvas.width, h: this.coverCanvas.height };
        // console.log({
        // 	type: 'draw',
        // 	d: this.record.drawing
        // });

        // *****************************원본입니다.***************************************************
        // 최소한 1개의 'end' 이벤트가 존재해야함.
        // const isDrawEventExist = this.record.drawing.event.some((element) => element.d.type === 'end');

        // *****************************수정입니다.***************************************************
        const isDrawEventExist = true;

        // console.log('isDrawEventExist', isDrawEventExist);
        this.record.recordingTitle = f.value.recordingTitle;

        // 답변 content 또는 drawing이 없는 경우
        // 현재 drawing 또는 content만 존재하면 되는 것으로 처리
        // --> drawing의 경우 event의 default 길이는 1임.
        if (!this.record.recordingTitle && !isDrawEventExist) {
            alert("You must write a title");
            return;
        }

        if (isDrawEventExist) {
            this.record.contentType = 2;
            this.record.drawing = this.record.drawing;
        }

        const drawPath = {
            gstd_key: "",
            bgImg_key: "",
            bgImg_location: "",
        };

        // https://stackoverflow.com/questions/39689171/rename-blob-form-append
        try {
            // // 백그라운드 이미지 key 리턴
            if (this.showBg == true) {
                await this.docService.bgImageUpload(this.imgFiles[0]).subscribe(
                    (data: any) => {
                        console.log("[[[ bgImg_key ]]]", data);
                        drawPath.bgImg_key = data.bgImg_key;
                        drawPath.bgImg_location = data.bgImg_location;
                    },
                    (err: any) => { }
                );
            }

            // 레코딩 파일 key 리턴
            if (this.record.contentType > 0) {
                const res: any = await this.uploadDrawing(this.record.drawing);
                // console.log('answer 등록 후 path와 키 등록 res:', res);
                const response = JSON.parse(res);
                drawPath.gstd_key = response.gstd_key;
            }

            console.log("[[[ drawPath ]]]", drawPath);
            this.docService
                .sendWhiteBoardRec(
                    this.docId,
                    this.record.recordingTitle,
                    drawPath.gstd_key,
                    drawPath.bgImg_key,
                    drawPath.bgImg_location
                )
                .subscribe(async (data: any) => {
                    this.dialogRef.close(true);
                });
        } catch (err) {
            console.log(err);
            this.dialogRef.close(false);
        }
        // 잠시 answerQuestion2 바꿨음
        // https://stackoverflow.com/questions/39689171/rename-blob-form-append
        // const result = await this.qnaService.answerQuestion2(this.answer);
        // console.log('result: ', result);
        // this.spinner.stop();
        // if (result.success) {
        // 	alert(this.MODAL.SUCCESS.REGISTER);
        // 	this.dialogRef.close(true);
        // } else {
        // 	alert(this.MODAL.ERROR.REGISTER);
        // 	this.dialogRef.close(false);
        // }
    }

    // -- 내부 함수
    /**
     *
     * Server로 Drawing data 전송
     * android에서 local image file을 사용하므로 native 방식으로 사용
     * - 서버에서 Amazon S3에 저장
     * - file명은 question document id로 설정
     *
     */
    uploadDrawing(drawingData) {
        // 용량 감소를 위해서 parameter 2를 삭제.
        // const blob = new Blob([JSON.stringify(drawingData, null, 2)], { type: 'application/json' });
        const blob = new Blob([JSON.stringify(drawingData)], { type: "application/json" });
        // console.log(blob);
        const filename = `${Date.now()}_rec.gstd`;
        const url = "http://localhost:3000/api/v1/collab/space/doc/saveGstdPath";

        return this.docService.uploadBlobToMultipart(url, filename, blob, "recording");
    }

    /**
     * 그리기 tool 변경
     * type: PEN or ERASER
     * color: 'black', 'blue', 'red'
     */

    changeTool(type: string, color: string) {
        console.log("change tool: " + type + ", color: " + color);
        if (type === DRAWING_TYPE.PEN) {
            this.canvasService.setTool({
                type: DRAWING_TYPE.PEN,
                color: color,
                width: CANVAS_CONFIG.penWidth,
            });
        } else if (type === DRAWING_TYPE.ERASER) {
            this.canvasService.setTool({
                type: DRAWING_TYPE.ERASER,
                color: null,
                width: CANVAS_CONFIG.eraserWidth,
            });
        } else {
            // 들어올일X
            alert("Wrong drawing tool selected. Try to select again.");
        }
    }

    /**
     *
     * 처음부터 다시 그리기
     * 1. canvas 초기화
     * 2. recordedData 초기화
     */
    initDrawing() {
        const confirmResult = confirm("처음부터 다시 그리시겠습니까?");
        if (confirmResult === true) {
            console.log(" ---> init drawing");
            this.canvasService.recordingClear();

            // tool 초기화 --> 새로운 event data 처음 처리.
            this.changeTool("pen", "black");
        } else {
            return;
        }
    }

    handleUploadFileChanged(event) {
        if (event.target.files && event.target.files[0]) {
            if (
                event.target.files[0].name.toLowerCase().endsWith(".jpg") ||
                event.target.files[0].name.toLowerCase().endsWith(".png")
            ) {
                // Image resize and update
                // this.resizeUpdate(event.target.files[0]);
            } else {
                alert("Only accept a png or jpg type of image");
                return;
            }
        } else {
            alert("cannot load the image file");
            return;
        }

        this.showBg = true;
        this.imgFiles = [];
        const files: File[] = event.target.files;
        if (event.target.files.length === 0) {
            // 미리보기 없애기(파일 선택창에서 취소 눌렀을 때..) --> 안들어옴?
            console.log("!! event.target.files.length === 0");
            this.imgPreview = null;
        } else {
            let url = URL.createObjectURL(event.target.files[0]);
            // console.log(event.target.files[0]);
            // console.log('URL', url);

            this.imgFiles.push(event.target.files[0]);
            const reader = new FileReader();

            reader.onload = (e) => {
                // console.log(e.target.result);
                // this.imgPreview = reader.result;
                this.imgPreview = url;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    emptyFiles() {
        this.showBg = false;
        this.imgPreview = null;
        this.imgFiles = [];
    }
}
