import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Observable, fromEvent, merge } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { CANVAS_CONFIG, DRAWING_TYPE, MOUSE_EVENT, POINTER_EVENT, TOUCH_EVENT } from "./canvas-config/canvas-config";
import { Drawing } from "./drawing/drawing";
import { Point } from "./drawing/model/point";
import { Tool } from "./drawing/model/tool";
import { EventReplay } from "./recording/event-replay";
import { Recording } from "./recording/recording";
import { Replay } from "./recording/replay";

@Injectable({
	providedIn: "root",
})
export class CanvasService {
	private drawingEventListener: Subscription;
	private drawingEventListenCanvas: HTMLCanvasElement;

	private drawingModule: Drawing;

	private recordingModule: Recording;

	private currentTool: any;

	zoomScale = 1;

	constructor() {}

	/**
	 * Canvas에 event listener 추가
	 * @param {canvas element} sourceCanvas event를 받아들일 canvas
	 * @param {canvas element} targetCanvas event가 최종적으로 그려질 canvas
	 * @param {object} tool  사용 tool (type, color, width)
	 * @param {string} mode  'normal','blind'
	 * @param {number} zoomScale 현재의 zoom scale
	 */
	drawingInit(
		obj: {
			eraserCanvas: HTMLCanvasElement;
			coverCanvas: HTMLCanvasElement;
			teacherCanvas: HTMLCanvasElement;
		},
		audioRecording: boolean
	) {
		this.drawingEventListenCanvas = obj.eraserCanvas;
		this.drawingModule = new Drawing(obj.eraserCanvas, obj.coverCanvas, obj.teacherCanvas, this.zoomScale);

		if (audioRecording) {
			this.recordingModule = new Recording();
			this.recordingModule.init({ audio: true });
		} else {
			this.recordingModule = new Recording();
			this.recordingModule.init();
		}

		this.setTool({
			type: DRAWING_TYPE.PEN,
			color: "black",
			width: CANVAS_CONFIG.penWidth,
		});
	}

	recordingClear() {
		this.recordingModule.clear();
		this.drawingModule.clearCanvas();
	}

	/**
	 * Event Replay를 위한 module
	 * @param dataEvent data의 'event'에 해당함
	 */
	getEventReplayModule(dataEvent): EventReplay {
		return new EventReplay(
			dataEvent,
			null, // Draw only의 time diff는 내부에서 계산.
			() => {
				this.clear();
			},
			(event) => {
				this.replayEvent(event);
			}
		);
	}

	/**
	 * Audio를 포함한 replay Module 설정
	 * - 모듈안에 event replay module을 포함
	 * @param data 모든 data.
	 */
	getReplayModule(data): Replay {
		return new Replay(
			data,
			() => {
				this.clear();
			},
			(event) => {
				this.replayEvent(event);
			}
		);
	}

	setTool(tool: Tool) {
		this.currentTool = tool;
		this.drawingModule.setTool(tool);
		this.recordingModule.recordEvent({
			type: "setTool",
			tool: {
				type: tool.type,
				color: tool.color,
				width: tool.width,
			},
		});
	}

	/**
	 * Event Handler에 따른 drawing 동작 (start)
	 * - canvas에 그리기. (drawing Module)
	 * - recording event 처리 (recording Module)
	 * @param point Point
	 */
	startDrawing(point: Point) {
		this.drawingModule.start(point);
		this.recordingModule.recordEvent({
			type: "start",
			point: point,
		});
	}

	/**
	 * Event Handler에 따른 drawing 동작 (Move)
	 * @param point Point
	 */
	moveDrawing(point: Point) {
		this.drawingModule.move(point);
		this.recordingModule.recordEvent({
			type: "move",
			point: point,
		});
	}
	/**
	 * Event Handler에 따른 drawing 동작 (End)
	 * @param point Point
	 */
	endDrawing() {
		this.drawingModule.end();
		this.recordingModule.recordEvent({ type: "end" }, true);
	}

	// 현재 사용 안되는듯...?
	// recordingClear만 있음.
	clear() {
		this.drawingModule.clearCanvas();
		this.recordingModule.recordEvent({ type: "clear" }, true);
	}

	/**
	 * 녹화 시작
	 */
	recordingStart() {
		this.recordingModule.recordStreamStart();

		// 녹음 초기에 현재 설정된 drawing Tool을 저장.
		this.setTool(this.currentTool);
	}

	/**
	 * 녹화 종료
	 * - recording-answer-modal에만 해당됨.
	 * - draw-answer-modal의 경우는 stop은 따로 없음.
	 */
	async recordingStop() {
		await this.recordingModule.recordStreamStop();
		// await new Promise((resolve => setTimeout(() => resolve(), 1000)));
		return this.recordingModule.getRecordedData();
	}

	/**
	 * 현재까지의 draw event 수신.
	 * - draw only에서 사용.
	 * -- draw only에는 recording start/stop 버튼이 따로 없음.
	 */
	getRecordEvent() {
		// promise
		return this.recordingModule.getRecordedData();
	}

	replayEvent(event) {
		switch (event.type) {
			case "clear": // kje 현재는 없는 듯...? --> clear는 event로 전달되는 것이아니라 녹화된 내용을 삭제함.
				this.drawingModule.clearCanvas();
				break;
			case "setTool":
				this.drawingModule.setTool(event.tool);
				break;
			case "start":
				this.drawingModule.start(event.point);
				break;
			case "move":
				this.drawingModule.move(event.point);
				break;
			case "end":
				this.drawingModule.end();
				break;
		}
	}

	// 사용 안하는 듯
	// replayFastEvent(event, isStart: boolean, isEnd: boolean) {
	// 	this.replayEvent(event);
	// }

	getDeviceScale(canvas) {
		const ctx = canvas.getContext("2d");
		// https://www.html5rocks.com/en/tutorials/canvas/hidpi/
		const devicePixelRatio = window.devicePixelRatio || 1;
		const backingStoreRatio =
			ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio ||
			1;
		let deviceScale = 1;
		// ios의 경우는 어떤지 학생으로 check ~~ todo
		if (navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") > -1) {
			deviceScale = devicePixelRatio / backingStoreRatio;
		}

		return deviceScale;
	}

	/**
	 * Main container관련 canvas Size 설정
	 *
	 */
	setCanvasSize(zoomScale, hwRatio, canvasContainer, coverCanvas, teacherCanvas, cursorCanvas) {
		this.zoomScale = zoomScale;
		canvasContainer.style.height = canvasContainer.clientWidth * hwRatio + "px"; // 아마도 8:6 비율...
		cursorCanvas.width = coverCanvas.width = teacherCanvas.width = canvasContainer.clientWidth;
		cursorCanvas.height = coverCanvas.height = teacherCanvas.height = canvasContainer.clientHeight;

		// zoom Scaling
		cursorCanvas.getContext("2d").setTransform(zoomScale, 0, 0, zoomScale, 0, 0);
		coverCanvas.getContext("2d").setTransform(zoomScale, 0, 0, zoomScale, 0, 0);
		teacherCanvas.getContext("2d").setTransform(zoomScale, 0, 0, zoomScale, 0, 0);
	}

	/**
	 * Canvas에 event listener 추가
	 */
	async addEventHandler() {
		this.drawingEventListener = merge(
			fromEvent(this.drawingEventListenCanvas, MOUSE_EVENT.MOUSE_DOWN).pipe(
				map((event: MouseEvent) => {
					return {
						coordinate: { clientX: event.clientX, clientY: event.clientY },
						event,
					};
				})
			),
			fromEvent(this.drawingEventListenCanvas, TOUCH_EVENT.TOUCH_START).pipe(
				map((event: TouchEvent) => {
					return {
						coordinate: { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY },
						event,
					};
				})
			)
		).subscribe((pointerInfo: { coordinate: { clientX; clientY }; event: PointerEvent }) => {
			this.startDrawing(this.getPoint(pointerInfo.coordinate, this.drawingEventListenCanvas));
			pointerInfo.event.preventDefault();

			fromEvent(this.drawingEventListenCanvas, POINTER_EVENT.POINTER_MOVE)
				.pipe(
					takeUntil(fromEvent(this.drawingEventListenCanvas, POINTER_EVENT.POINTER_UP)),
					takeUntil(fromEvent(this.drawingEventListenCanvas, POINTER_EVENT.POINTER_LEAVE))
				)
				.subscribe({
					next: (event: PointerEvent) => {
						// console.log('next');
						// console.log(event);
						this.moveDrawing(this.getPoint(event, this.drawingEventListenCanvas));
						event.preventDefault();
					},
					error: null,
					complete: () => {
						console.log("endDrawing");
						this.endDrawing();
					},
				});
		});
	}

	/**
	 * Canvas에 적용된 event listener 해제
	 */
	releaseEventHandler() {
		if (this.drawingEventListener) {
			this.drawingEventListener.unsubscribe();
			this.drawingEventListener = null;
		}
	}

	/**
	 * Point 받아오기
	 * - zoom인 경우 zoom 처리 전의 좌표 *
	 * @param {*} event touch 또는 mouse event
	 * @param {*} target event를 받아들이는 canvas
	 * @param {*} zoomScale 현재의 zoom scale
	 */
	private getPoint(event, target) {
		const canvas_rect = target.getBoundingClientRect();
		// console.log('getPoint');
		// console.log(canvas_rect);
		return {
			x: Math.round((event.clientX - canvas_rect.left) / this.zoomScale),
			y: Math.round((event.clientY - canvas_rect.top) / this.zoomScale),
		};
	}
}
