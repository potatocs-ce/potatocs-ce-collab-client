import { EventData } from "./model/event-data";

export class EventReplay {
	private eventRecordData: EventData[];

	private eventInitializeFunction: () => void;
	private eventReplayFunction: (data: any) => void;
	private getTimeDiffInSecFunction: (currentTimeOffset: number) => number;

	private currentEventPlayIndex: number;
	public isPlaying: boolean;
	private timeoutId: any;
	private playCount = 0;

	constructor(
		eventRecordData: EventData[], // draw event data
		getTimeDiffInSecFunction: (currentTimeOffset: number) => number, // 시간 계산 함수: 현재 audio가 있는 경우만 외부에서 처리.
		eventInitializeFunction: () => void, // event 초기화 -> canvas 초기화, recording 부분 초기화 (단, recording은 replay시 필요없음... todo.)
		eventReplayFunction: (data: any) => void // event Replay시 사용되는 함수 --> canvas service에서 처리.
	) {
		this.eventRecordData = eventRecordData;
		this.getTimeDiffInSecFunction = getTimeDiffInSecFunction;
		this.eventInitializeFunction = eventInitializeFunction;
		this.eventReplayFunction = eventReplayFunction;

		this.isPlaying = false;
		this.clearState();
	}

	/**
	 *
	 * Draw의 event drawing Play.
	 *
	 */
	async play() {
		// 현재 play 중인 경우 return;
		if (this.isPlaying) {
			return;
		}

		console.log(">> event-replay: Start");
		this.playCount++;
		/*---------------------------------------------------
			Play 상태가 아니면서 event가 모두 그려진 경우.
			- index = 0으로 변환.
			- eventInitializeFunction 호출.
				--> canvas clear 등의 기능으로 외부에서 inject.
		-----------------------------------------------------*/
		if (!this.isPlaying && this.currentEventPlayIndex === this.eventRecordData.length) {
			console.log("clear State");
			this.clearState();
		}

		this.isPlaying = true;
		/*----------------------------------------------
			timeDiff 함수가 전달된 경우 : audio 포함.
			timeDiff 함수가 null인 경우: draw only.
		-----------------------------------------------*/
		const isDrawOnly = this.getTimeDiffInSecFunction ? false : true;
		// Drawing 반복
		// console.log(this.currentEventPlayIndex);
		for (; this.currentEventPlayIndex < this.eventRecordData.length; this.currentEventPlayIndex++) {
			const value = this.eventRecordData[this.currentEventPlayIndex];

			// 이동 등에 의해서 변경된 경우 탈출하기 위한 변수!
			const currentPlayCount = this.playCount;

			/*--------------------------------------------------------------
				1. Audio 포함 
				- audio player의 시간과의 동기를 위해 time Diff 함수 주입
				2. Draw Only 
				- 하나의 Draw stroke 사이의 시간 간격을 200msec로 제한.
			------------------------------------------------------------------*/
			let timeDiff;
			if (isDrawOnly) {
				let prevTimeOffset = 0;
				if (this.currentEventPlayIndex > 0) {
					prevTimeOffset = this.eventRecordData[this.currentEventPlayIndex - 1].t;
				}
				timeDiff = Math.min(200, value.t - prevTimeOffset); // 200msec 제한 : UI 측면...
			} else {
				timeDiff = this.getTimeDiffInSecFunction(value.t);
			}

			if (timeDiff > 0) {
				await this.sleep(timeDiff);
			}

			// console.log(this.playCount, currentPlayCount);
			/*--------------------------------------------------------
				1. play가 중단되었거나 
				2. play count가 다른 경우 
				  ==> (seek 등으로 play 중에 이동 ...)
			---------------------------------------------------------*/
			if (!this.isPlaying || currentPlayCount !== this.playCount) {
				return;
			}
			// canvas service의 replayEvent 참조
			this.eventReplayFunction(value.d);
		}

		this.isPlaying = false;
	}

	pause() {
		this.isPlaying = false;
		// sleep 해제 방법?
		clearTimeout(this.timeoutId);
	}

	stop() {
		this.isPlaying = false;
		this.currentEventPlayIndex = this.eventRecordData.length;
		// console.log(this.currentEventPlayIndex);
		this.fastPlayFromStart(this.eventRecordData.length - 1);
	}

	async playOneUnitForward() {
		this.isPlaying = false;
		const index = this.findNextEndOfUnitIndex(this.currentEventPlayIndex);
		this.clearState();
		this.currentEventPlayIndex = index + 1;
		this.fastPlayFromStart(index);
	}

	async playOneUnitBack() {
		this.isPlaying = false;
		const index = this.findPrevEndOfUnitIndex(this.currentEventPlayIndex);
		this.clearState();
		this.currentEventPlayIndex = index + 1;
		await this.fastPlayFromStart(index);
	}

	seek(seconds: number) {
		this.isPlaying = false;
		const index = this.findEventDataIndexWithSeconds(seconds);
		this.clearState();
		// this.currentEventPlayIndex = index + 1;
		this.currentEventPlayIndex = index;
		this.fastPlayFromStart(index);
	}

	forward(seconds: number) {
		this.isPlaying = false;
		const index = this.findEventDataIndexWithSeconds(seconds);
		this.clearState();
		// this.currentEventPlayIndex = index + 1;
		this.currentEventPlayIndex = index;
		this.fastPlayFromStart(index);
	}

	backward(seconds: number) {
		this.isPlaying = false;
		const index = this.findEventDataIndexWithSeconds(seconds);
		this.clearState();
		// this.currentEventPlayIndex = index + 1;
		this.currentEventPlayIndex = index;
		this.fastPlayFromStart(index);
	}

	private findPrevEndOfUnitIndex(currentIndex: number): number {
		let index = currentIndex;
		index--;
		while (index > 0) {
			index--;
			if (this.eventRecordData[index].isEndOfUnit) {
				return index;
			}
		}
		return 0;
	}

	private findNextEndOfUnitIndex(currentIndex: number): number {
		let index = currentIndex;
		while (index + 1 < this.eventRecordData.length) {
			index++;
			if (this.eventRecordData[index].isEndOfUnit) {
				return index;
			}
		}
		return this.eventRecordData.length - 1;
	}

	private findEventDataIndexWithSeconds(sec: number): number {
		let minIndex = 0;
		let maxIndex = this.eventRecordData.length - 1;
		let currentIndex;
		let currentElement;

		while (minIndex <= maxIndex) {
			currentIndex = Math.round((minIndex + maxIndex) / 2) || 0;

			// console.log(minIndex, maxIndex, currentIndex);
			currentElement = this.eventRecordData[currentIndex].t; // timeoffset.

			if (currentElement < sec) {
				minIndex = currentIndex + 1;
			} else if (currentElement > sec) {
				maxIndex = currentIndex - 1;
			} else {
				break;
			}
		}
		return currentIndex;
	}

	/**
	 * 처음부터 endIndex까지 모두 다시 그림
	 *  - forward/backward 등, 다시 그리는 경우 사용.
	 * @param endIndex 그려야 하는 마지막 index.
	 */
	private fastPlayFromStart(endIndex: number) {
		if (this.eventRecordData.length < 1 || endIndex === 0) {
			return;
		} else if (this.eventRecordData.length === 1) {
			this.eventReplayFunction(this.eventRecordData[0].d);
			return;
		}

		this.eventReplayFunction(this.eventRecordData[0].d);
		for (let i = 1; i < endIndex && i < this.eventRecordData.length; i++) {
			this.eventReplayFunction(this.eventRecordData[i].d);
		}
		this.eventReplayFunction(this.eventRecordData[endIndex].d);
	}

	/**
	 * replay 상태 초기화
	 * - index는 처음으로
	 * - canvas는 clear.
	 */
	private clearState() {
		this.currentEventPlayIndex = 0;
		this.eventInitializeFunction();
	}

	/**
	 * event 사이의 term 동안 sleep...
	 * @param ms sleep 시간.
	 */
	private sleep(ms = 0) {
		// console.log("SLEEP:",ms);
		return new Promise((r) => setTimeout(r, ms));
	}
}
