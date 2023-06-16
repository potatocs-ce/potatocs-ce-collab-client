import { Observable, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AUDIO_RECORDING_EVENT } from '../canvas-config/canvas-config';
import { EventData } from './model/event-data';

declare var MediaRecorder: any;

export class Recording {
	private eventBuffer: EventData[];
	private audioBuffer: any[];

	private mediaRecorder: any;
	private mediaStream: any;

	private startedAt: number;
	private isRecording: boolean;

	private recordingOption?: { audio?: boolean };

	private static getCurrentSeconds(): number {
		return Date.now();
	}

	clear() {
		// audio stop
		this.recordStreamStop();

		// buffer 초기화
		this.eventBuffer = [];
		this.audioBuffer = [];
	}

	async init(option?: { audio?: boolean }) {
		this.recordingOption = option;

		// 이 부분에서 device 없을 때 에러 남..devicenotfound
		// promise resolve 필요..
		if (this.recordingOption && this.recordingOption.audio) {

			this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			this.mediaRecorder = new MediaRecorder(this.mediaStream, { audioBitsPerSecond: 64000 });

			fromEvent(this.mediaRecorder, AUDIO_RECORDING_EVENT.DATA_AVAILABLE)
			.pipe(
				takeUntil(fromEvent(this.mediaRecorder, AUDIO_RECORDING_EVENT.ON_STOP)),
				takeUntil(fromEvent(this.mediaRecorder, AUDIO_RECORDING_EVENT.ON_ERROR))
				)
				.subscribe((event: any) => {
					this.audioBuffer.push(event.data);
				});

		}

		this.clear();

		// console.log(' >> recording.ts- init');
		this.isRecording = false;
	}

	recordStreamStart() {
		this.startedAt = Recording.getCurrentSeconds();
		if (this.recordingOption && this.recordingOption.audio) {
			this.mediaRecorder.start();
		}
		this.isRecording = true;
	}

	recordEvent(eventData: any, isEndOfUnit?: boolean) {
		if (this.isRecording) {
			if (isEndOfUnit) {
				this.eventBuffer.push({
					t: Recording.getCurrentSeconds() - this.startedAt,
					d: eventData,
					isEndOfUnit: true
				});

                console.log('true', this.eventBuffer)
			} else {
				this.eventBuffer.push({
					t: Recording.getCurrentSeconds() - this.startedAt,
					d: eventData,
                    isEndOfUnit: true
				});
                console.log('false', this.eventBuffer)
			}
		}
	}

	recordStreamStop() {
		return new Promise<void>((resolve, reject) => {
			// console.log(this.audioBuffer);
			// console.log(this.eventBuffer);
			if (this.isRecording) {
				if (this.recordingOption && this.recordingOption.audio) {
					this.mediaRecorder.stop();
					// isRecording은 음성 녹음이 있는 경우에만 off.
					this.isRecording = false;
					this.mediaRecorder.onstop = function () {
						resolve();
					};
				} else {
					resolve();
				}
			} else {
				resolve();
			}
		});
	}

	getRecordedData() {
		return new Promise((resolve, reject) => {
			if (this.recordingOption && this.recordingOption.audio) {
				const reader = new FileReader();
				reader.onload = () => {
					// console.log({
					// 	event: this.eventBuffer,
					// 	audio: reader.result
					// });
					resolve({
						event: this.eventBuffer,
						audio: reader.result
					});
				};
				const temp = new Blob(this.audioBuffer);
				reader.readAsBinaryString(temp);
			} else {
				resolve({
					event: this.eventBuffer,
					audio: null
				});
			}
		});
	}
}
