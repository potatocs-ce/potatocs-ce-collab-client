import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebcamDeviceService {

    // 웹캠이 연결되어 있는지 확인하는 메소드
    async isWebcamConnected(): Promise<boolean> {
        try {
            // 장치 목록 가져오기
            const devices = await navigator.mediaDevices.enumerateDevices();

            // 비디오 입력 장치가 있는지 확인
            const hasWebcam = devices.some(device => device.kind === 'videoinput');

            return hasWebcam;
        } catch (error) {
            console.error('Error accessing media devices.', error);
            return false;
        }
    }
}
