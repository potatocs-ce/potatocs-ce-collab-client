import { RecordData } from './model/record-data';
import { EventReplay } from './event-replay';


export class Replay {
	public audioPlayer: any;
	private eventPlayer: EventReplay;

	public isPlaying: boolean;
	private currentPlayStatus: boolean;

	// duration_mSec = 0 ; // 총 play 시간
	// currentTime_mSec = 0; // 현재 play 시간


	constructor(
		recordingData: RecordData,
		eventInitializeFunction: () => void,
		eventReplayFunction: (event: any) => void
	) {

		if (recordingData.audio && recordingData.audio.length > 0) {

			const array = new Uint8Array(recordingData.audio.length);
			// console.log(array);
			for (let i = 0; i < recordingData.audio.length; i++) {
				array[i] = recordingData.audio.charCodeAt(i);
			}
			const audioBlob = new Blob([array]);
			const audioUrl = URL.createObjectURL(audioBlob);
			this.audioPlayer = new Audio(audioUrl);
			// console.log('audioplayer: ', this.audioPlayer);

			/*--------------------------------------
				Chrome에서 생성한 webm은 duration이 저장되지 않는 문제 발생 (BUG)
				=> 여기서 play 할때 편법으로 시간이 나오도록 변경.
					https://stackoverflow.com/questions/38443084/
					how-can-i-add-predefined-length-to-audio-recorded-from-mediarecorder-in-chrome/39971175#39971175
					audio event : https://www.w3schools.com/tags/ref_av_dom.asp
			------------------------------------------------------*/

			// loadeddata, canplay, canplaythrough
			this.audioPlayer.addEventListener('loadeddata', () => {
				console.log(' ------------------ audio data loaded --------------- ');
				if (this.audioPlayer.duration === Infinity) {
					// 큰 숫자를 넣으면 마지막으로 변경.
					this.audioPlayer.currentTime = 1e101;

					// 시간이 마지막으로 변경된 후 바로 time 0로 이동
					this.audioPlayer.ontimeupdate = () => {
						this.audioPlayer.currentTime = 0.0001;
						// console.log(`audioplayer currentTime: ${this.audioPlayer.currentTime} / ${this.audioPlayer.duration}`);
						this.audioPlayer.ontimeupdate = () => {
							return false;
						};
					};
				}
			});
		}

		this.eventPlayer = new EventReplay(
			recordingData.event,
			// kje: timeOffset을 msec 단위로. currentTime은 sec => msec 단위로 변경...
			(currentTimeOffset: number) => currentTimeOffset - this.audioPlayer.currentTime * 1000,
			eventInitializeFunction,
			eventReplayFunction
		);

		this.audioPlayer.onended = () => {
			this.isPlaying = false;
			this.audioPlayer.currentTime = 0;
		};

		this.isPlaying = false;
	}

	play() {
		if (!this.isPlaying) {
			this.isPlaying = true;
			this.audioPlayer.play();
			this.eventPlayer.play();
		}
	}

	pause() {
		if (this.isPlaying) {
			this.isPlaying = false;
			this.audioPlayer.pause();
			this.eventPlayer.pause();
		}
	}

	stop() {
		this.isPlaying = false;
		this.audioPlayer.pause();
		this.audioPlayer.currentTime = 0;
		this.eventPlayer.stop();
	}

	// 10초 뒤로
	forward() {
		this.currentPlayStatus = this.isPlaying;
		if (this.isPlaying) {
			this.pause();
		}
		this.audioPlayer.currentTime = Math.min(this.audioPlayer.currentTime + 5, this.audioPlayer.duration - 0);
		this.eventPlayer.seek(this.audioPlayer.currentTime * 1000);
		console.log(this.audioPlayer.currentTime);
		if (this.currentPlayStatus) {
			this.play();
		}
	}

	// 10초 앞으로
	backward() {
		this.currentPlayStatus = this.isPlaying;
		if (this.isPlaying) {
			this.pause();
		}
		this.audioPlayer.currentTime = Math.max(this.audioPlayer.currentTime - 5, 0);
		this.eventPlayer.seek(this.audioPlayer.currentTime * 1000);
		if (this.currentPlayStatus) {
			this.play();
		}
	}


	seek(secondsMsec: number) {
		this.audioPlayer.currentTime = secondsMsec / 1000;
		this.eventPlayer.seek(secondsMsec);
	}

	// 포함시킬지 여부... ==> seek 중간 처리.
	onSeek(secondsMsec: number) {
		this.eventPlayer.seek(secondsMsec);
	}
}
