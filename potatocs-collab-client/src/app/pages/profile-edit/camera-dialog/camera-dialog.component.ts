import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { ProfilesService } from '../../../services/profiles/profiles.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
    selector: 'app-camera-dialog',
    standalone: true,
    imports: [],
    templateUrl: './camera-dialog.component.html',
    styleUrl: './camera-dialog.component.scss'
})
export class CameraDialogComponent {
    @ViewChild('video') video: ElementRef<HTMLVideoElement>;
    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    private dialogRef = inject(MatDialogRef<CameraDialogComponent>);

    constructor(
        private profileService: ProfilesService,
        private dialogService: DialogService,
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
        const context = this.canvas.nativeElement.getContext('2d');
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
        console.log(frame)
        this.profileService.faceDetection(frame).subscribe(
            (data: any) => {
                // console.log(data);
                // console.log(data.profileChange);
                console.log(data)
                if (data.message == 'Not Detection') {
                    this.dialogService.openDialogNegative(`Face Detection Fail. Please check again.`);
                }
                else {
                    this.dialogService.openDialogPositive(`Your Face has updated successfully.`);
                    this.closeModal()
                }

            },
            (err: any) => {
                console.log(err)
            }
        );
        // }, 1000);

    }

    closeModal(): void {
        this.dialogRef.close({ result: 'some data' });
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