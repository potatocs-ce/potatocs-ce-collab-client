import { Tool } from "./model/tool";
import { Point } from "./model/point";
import { DRAWING_TYPE } from "../canvas-config/canvas-config";

/**
 * Drawing 관련 Class
 * - eraser Canvas (cursor Canvas)
 * - cover Canvas
 * - teacher Canvas
 */
export class Drawing {
	private preDrawingCanvasContext: CanvasRenderingContext2D;
	private drawingCanvasContext: CanvasRenderingContext2D;
	private eraserMarkerCanvasContext: CanvasRenderingContext2D;

	private zoomScale: number;
	private drawingTool: Tool;
	private drawingBuffer: {
		points: Point[];
	};

	private static drawingArc(context: CanvasRenderingContext2D, point: Point, lineWidth: number, fillWidth: number) {
		context.beginPath();
		context.lineWidth = lineWidth;
		context.arc(point.x, point.y, fillWidth / 3, 0, Math.PI * 2, !0);
		// context.arc(point.x, point.y, fillWidth / 2, 0, Math.PI * 2, !0);

		context.fill();
		context.stroke();
		context.closePath();
	}

	private static drawingLine(
		context: CanvasRenderingContext2D,
		prevPoint: Point,
		currentPoint: Point,
		lineWidth: number
	) {
		context.beginPath();
		context.lineWidth = lineWidth;
		context.moveTo(prevPoint.x, prevPoint.y);
		context.lineTo(currentPoint.x, currentPoint.y);
		context.stroke();
		context.closePath();
	}

	private static drawingQuadrationCurve(
		context: CanvasRenderingContext2D,
		prevPrevPoint: Point,
		prevPoint: Point,
		currentPoint: Point,
		lineWidth: number
	) {
		context.beginPath();
		context.lineWidth = lineWidth;
		const middlePoint1 = {
			x: (prevPrevPoint.x + prevPoint.x) / 2,
			y: (prevPrevPoint.y + prevPoint.y) / 2,
		};
		const middlePoint2 = {
			x: (prevPoint.x + currentPoint.x) / 2,
			y: (prevPoint.y + currentPoint.y) / 2,
		};

		context.moveTo(middlePoint1.x, middlePoint1.y);
		context.quadraticCurveTo(prevPoint.x, prevPoint.y, middlePoint2.x, middlePoint2.y);
		context.stroke();
		context.closePath();
	}

	private static drawingQuadrationCurveAll(context: CanvasRenderingContext2D, points: Point[], lineWidth: number) {
		context.lineWidth = lineWidth;

		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		let i = 1;
		for (; i < points.length - 1; i++) {
			const middlePoint2 = {
				x: (points[i - 1].x + points[i].x) / 2,
				y: (points[i - 1].y + points[i].y) / 2,
			};
			context.quadraticCurveTo(points[i - 1].x, points[i - 1].y, middlePoint2.x, middlePoint2.y);
		}
		// 마지막 line.
		context.quadraticCurveTo(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
		context.stroke();
		context.closePath();
	}

	constructor(
		eraserMarkerCanvas: HTMLCanvasElement,
		preDrawingCanvas: HTMLCanvasElement,
		drawingCanvas: HTMLCanvasElement,
		zoomScale: number
	) {
		this.eraserMarkerCanvasContext = eraserMarkerCanvas.getContext("2d");
		this.preDrawingCanvasContext = preDrawingCanvas.getContext("2d");
		this.drawingCanvasContext = drawingCanvas.getContext("2d");
		this.zoomScale = zoomScale;

		this.drawingTool = {
			type: DRAWING_TYPE.PEN,
			color: "black",
			width: 2,
		};
	}

	private static clearCanvasWithContext(context: CanvasRenderingContext2D) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	}

	setTool(tool: Tool) {
		this.drawingTool = {
			width: tool.width ? tool.width : this.drawingTool.width,
			color: tool.color ? tool.color : this.drawingTool.color,
			type: tool.type ? tool.type : this.drawingTool.type,
		};
	}

	private clearCanvasWithContext(context: CanvasRenderingContext2D) {
		context.clearRect(0, 0, context.canvas.width / this.zoomScale, context.canvas.height / this.zoomScale);
	}

	private setContext(
		context: CanvasRenderingContext2D,
		options: {
			globalCompositeOperation?: any;
			fillStyle?: any;
			strokeStyle?: any;
			lineWidth?: any;
		}
	) {
		context.lineCap = "round";
		context.lineJoin = "round";
		context.globalCompositeOperation = options.globalCompositeOperation || "source-over";

		switch (this.drawingTool.type) {
			case DRAWING_TYPE.PEN:
				context.fillStyle = options.fillStyle || this.drawingTool.color;
				context.strokeStyle = options.strokeStyle || this.drawingTool.color;
				break;
			case DRAWING_TYPE.ERASER:
				context.fillStyle = options.fillStyle || "white";
				context.strokeStyle = options.strokeStyle || "white";
				break;
		}
	}

	private printEraserMarkerOnEraserMarkerCanvas(point: Point) {
		this.eraserMarkerCanvasContext.beginPath();
		this.setContext(this.eraserMarkerCanvasContext, {
			strokeStyle: "black",
			fillStyle: "white",
		});
		Drawing.drawingArc(this.eraserMarkerCanvasContext, point, 1, this.drawingTool.width);
		this.eraserMarkerCanvasContext.closePath();
	}

	clearCanvas() {
		this.clearCanvasWithContext(this.preDrawingCanvasContext);
		this.clearCanvasWithContext(this.drawingCanvasContext);
		this.clearCanvasWithContext(this.eraserMarkerCanvasContext);
	}

	/************************************** drawing start **************************************/
	start(point: Point) {
		// this.clearCanvasWithContext(this.eraserMarkerCanvasContext);

		const drawingContext = this.preDrawingCanvasContext;
		const toolWidth = this.drawingTool.width;

		// drawing buffer 초기화
		this.drawingBuffer = {
			points: [],
		};

		// context 설정
		this.setContext(drawingContext, {});

		// conver canvas에 그림
		Drawing.drawingArc(drawingContext, point, 1, toolWidth);

		// 지우개 표시
		if (this.drawingTool.type === DRAWING_TYPE.ERASER) {
			this.printEraserMarkerOnEraserMarkerCanvas(point);
		}

		// history 저장
		this.drawingBuffer.points.push({
			x: point.x,
			y: point.y,
		});
	}

	/************************************** drawing move **************************************/
	move(point: Point) {
		this.clearCanvasWithContext(this.eraserMarkerCanvasContext);

		// const point: Point = this.getPointWithScale(originPoint);
		const points = this.drawingBuffer.points;
		const drawingContext = this.preDrawingCanvasContext;
		const toolWidth = this.drawingTool.width;

		// context 설정
		this.setContext(drawingContext, {});

		// if (this.drawingTool.type === DRAWING_TYPE.ERASER) {
		// 	toolWidth = toolWidth * 5;
		// }

		// drawing line
		// drawingContext.beginPath();
		// if (points.length < 2) {
		if (points.length < 3) {
			Drawing.drawingLine(drawingContext, points[points.length - 1], point, toolWidth);
		} else {
			Drawing.drawingQuadrationCurve(
				drawingContext,
				points[points.length - 2],
				points[points.length - 1],
				point,
				toolWidth
			);
		}

		// 지우개 표시
		if (this.drawingTool.type === DRAWING_TYPE.ERASER) {
			this.printEraserMarkerOnEraserMarkerCanvas(point);
		}

		// console.log(this.drawingBuffer.points);
		// history 저장
		this.drawingBuffer.points.push({
			x: point.x,
			y: point.y,
		});
	}

	/************************************** drawing end **************************************/
	end() {
		this.clearCanvasWithContext(this.preDrawingCanvasContext);
		this.clearCanvasWithContext(this.eraserMarkerCanvasContext);

		const drawingContext = this.drawingCanvasContext;
		const points = this.drawingBuffer.points;
		const toolWidth = this.drawingTool.width;

		const options = {};
		if (this.drawingTool.type === DRAWING_TYPE.ERASER) {
			options["globalCompositeOperation"] = "destination-out";
			// toolWidth = toolWidth * 5;
		}

		this.setContext(drawingContext, options);

		if (points.length < 3) {
			Drawing.drawingArc(drawingContext, points[0], 1, toolWidth);
			return;
		}

		// 전체 다시그리기
		Drawing.drawingQuadrationCurveAll(drawingContext, points, toolWidth);
	}
}
