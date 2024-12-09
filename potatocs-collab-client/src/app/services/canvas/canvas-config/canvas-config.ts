/***************  [ DRAWING/RECORDING 관련 설정 ]  **************** */
export const CANVAS_CONFIG = {
	maxContainerHeight: 0,
	maxContainerWidth: 0,
	CSS_UNIT: 96 / 72, // 100% PDF 크기 => 실제 scale은 1.333....
	deviceScale: 1,
	maxZoomScale: 3,
	minZoomScale: 0.1,
	penWidth: 2,
	eraserWidth: 30,
};

export const AUDIO_RECORDING_EVENT = {
	DATA_AVAILABLE: "dataavailable",
	ON_STOP: "stop",
	ON_ERROR: "error",
};

export const MOUSE_EVENT = {
	MOUSE_DOWN: "mousedown",
};

export const TOUCH_EVENT = {
	TOUCH_START: "touchstart",
};

export const POINTER_EVENT = {
	POINTER_UP: "pointerup",
	POINTER_MOVE: "pointermove",
	POINTER_LEAVE: "pointerleave",
};

export const POINTER_TYPE = {
	PEN: "pen",
	MOUSE: "mouse",
	TOUCH: "touch",
};

export const CANVAS_EVENT = {
	GEN_DRAW: "gen:newDrawEvent",
	RESIZE_CONTAINER: "resize:container",
	FINISH_REPLAY: "finish:replay",
};

export const REPLAY_STATUS = {
	STOP: "stop",
	PLAY: "play",
	PAUSE: "pause",
	MOVE: "move",
	MOVE_PLAY: "play",
	MOVE_FORWARD: "forward",
	MOVE_BACKWARD: "backward",
	CLOSE: "close",
};

export const DRAWING_TYPE = {
	PEN: "pen",
	ERASER: "eraser",
};

export const SITEMNG_QUESTION_CONFIG = {
	IMAGE_ROOT: "/mngImage/",
};

export const ENG_ANSWER_CONFIG = {
	IMAGE_ROOT: "/engAnswerImage/",
};
