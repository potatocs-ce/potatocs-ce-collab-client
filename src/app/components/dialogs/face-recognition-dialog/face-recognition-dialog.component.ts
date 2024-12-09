import { MatDialogRef } from '@angular/material/dialog';
import { ProfilesService } from '../../../services/profiles/profiles.service';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';

@Component({
    selector: 'app-face-recogniton-dialog',
    standalone: true,
    imports: [],
    templateUrl: './face-recognition-dialog.component.html',
    styleUrl: './face-recognition-dialog.component.scss'
})
export class FaceRecognitionDialogComponent {
    @ViewChild('video') video: ElementRef<HTMLVideoElement>;
    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    private dialogRef = inject(MatDialogRef<FaceRecognitionDialogComponent>);


    constructor(
        private profileService: ProfilesService,
    ) { }

    ngOnInit() {
        this.startCamera();
    }


    startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this.video.nativeElement.srcObject = stream;
            this.video.nativeElement.play();
        });
    }

    captureFrame() {
        const context: any = this.canvas.nativeElement.getContext('2d')
        context.drawImage(this.video.nativeElement, 0, 0, 640, 480);
        const frame = this.canvas.nativeElement.toDataURL('image/jpeg');
        // Send the frame to the server
        this.sendFrameToServer(frame);
    }

    sendFrameToServer(frame: string) {
        // Implement the logic to send the frame to the server
        // For example, using HttpClient to POST the frame to a server endpoint
        // setInterval(() => {
        // context.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
        // const dataUrl = canvas.toDataURL('image/jpeg');
        this.profileService.faceRecognition(frame).subscribe(
            (data: any) => {
                // console.log(data);
                // console.log(data.profileChange);
                console.log(data)
                this.closeModal(data)
            },
            (err: any) => {
                console.log(err)
            }
        );
        // }, 1000);

    }

    closeModal(data): void {
        this.dialogRef.close(data);
    }

    // startCamera() {
    //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //         this.video.nativeElement.srcObject = stream;
    //     }).catch(error => {
    //         console.error('Error accessing webcam: ', error);
    //     });
    // }

    // startStreaming() {
    //     const canvas = document.createElement('canvas');
    //     canvas.width = this.video.nativeElement.width;
    //     canvas.height = this.video.nativeElement.height;
    //     const context = canvas.getContext('2d');

    // setInterval(() => {
    //     context.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
    //     const dataUrl = canvas.toDataURL('image/jpeg');
    //     this.http.post('http://localhost:5000/stream', { image: dataUrl }).subscribe();
    // }, 100);
    // }
}
