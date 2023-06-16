import { Component, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ActivatedRoute } from '@angular/router';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

//table page
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

// env
import { environment } from 'src/environments/environment';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component'
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';
import { DataService } from 'src/@dw/store/data.service';

//view table
export interface PeriodicElement {
    Meeting: String;
    Date: Date;
    // Time: String,
}

@Component({
    selector: 'app-meeting-list',
    templateUrl: './meeting-list.component.html',
    styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
    meetingItems: any = {};
    mobileWidth: any;
    pageSize;
    pageSizeOptions;

    // 브라우저 크기 변화 체크 ///
    resizeObservable$: Observable<Event>
    resizeSubscription$: Subscription
    ///////////////////////
    pageEvent: PageEvent
    private API_URL = environment.API_URL;

    @Input() spaceInfo: any;
    @Input() memberInSpace: any;
    meetingArray;
    slideArray = [];

    spaceTime: any;
    displayedColumns: string[] = ['meetingTitle', 'meetingDescription', 'start_date', 'start_time'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private unsubscribe$ = new Subject<void>();

    userData: any;

    constructor(
        public dialog: MatDialog,
        private docService: DocumentService,
        private route: ActivatedRoute,
        // private commonService: CommonService,
        private dialogService: DialogService,
        private meetingListStorageService: MeetingListStorageService,
        private snackbar: MatSnackBar,
        private dataService: DataService

    ) {

    }

    ngOnInit() {
  
    
    }
    
    ngOnChanges(){
        this.spaceTime = this.route.snapshot.params.spaceTime;
        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                console.log(data);
                this.userData = data;
                this.meetingIsHost();
            }
        )
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        // this.resizeSubscription$.unsubscribe();
    }

    // 미팅 생성 
    openDialogDocMeetingSet() {
        this.spaceTime = this.route.snapshot.params.spaceTime;

        const dialogRef = this.dialog.open(DialogMeetingSetComponent, {
            data: {
                spaceId: this.spaceTime
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close');
            // this.getMeetingList();
        });
    }

    //미팅 호스트인지 확인하고 호스트면 툴바 보이게하기
    meetingIsHost(){
        this.meetingListStorageService.meeting$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.meetingArray = this.docService.statusInMeeting(data);
                // this.meetingArray = new MatTableDataSource<PeriodicElement>(this.meetingArray);
                // this.onResize();

                for (let i = 0; i < this.meetingArray.length; i++) {
                    const hostId = this.meetingArray[i].manager;
                   
                    if (hostId == this.userData._id) {
                        this.meetingArray[i].isHost = true;
                    }
                    else {
                        this.meetingArray[i].isHost = false;
                    }
                    for (let j = 0; j < this.memberInSpace.length; j++) {
                        const memberId = this.memberInSpace[j]._id;
                        if (hostId == memberId) {

                            this.meetingArray[i].manager_name = this.memberInSpace[j].name;
                            this.meetingArray[i].manager_profile = this.memberInSpace[j].profile_img;
                        }
                    }

                }
            }
        )
    }
    // 미팅 디테일 오픈
    openDialogMeetingDetail(data) {
        const dialogRef = this.dialog.open(MeetingDetailComponent, {

            data: {
                _id: data._id,
                spaceId: data.spaceId,
                meetingTitle: data.meetingTitle,
                meetingDescription: data.meetingDescription,
                manager: data.manager,
                createdAt: data.createdAt,
                enlistedMembers: data.enlistedMembers,
                // isDone: false,
                start_date: data.start_date,
                start_time: data.start_time,
                status: data.status,
                space_id: this.spaceTime,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close');
            // this.getMeetingList();
        });
    }

    toggle(meetingData, index) {

        console.log(this.slideArray);
        console.log(meetingData);
        // console.log("TOGGLE DATA >>" + data);
        // console.log("INDEX DATA >>" + index);
        // 1단계 status가 pending 일때 
        if (meetingData.status == 'pending') {
            this.pendingToOpen(meetingData);
        } else if (meetingData.status == 'Open') {
            console.log('data status', meetingData.status);
            this.closeMeeting(meetingData);
        } else if (meetingData.status == 'Close') {
            console.log('data status', meetingData.status);
            this.openMeeting(meetingData);
        }
    }

    pendingToOpen(meetingData) {
        // console.log('data status', data.status);
        let data = {
            _id: meetingData._id,
            spaceId: meetingData.spaceId,
            status: 'Open'
        }
        this.docService.openMeeting(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
        this.snackbar.open('Meeting Open', 'Close', {
            duration: 3000,
            horizontalPosition: "center"
        });
    }

    // 호스트가 미팅을 연다
    openMeeting(meetingData) {
        let data = {
            _id: meetingData._id,
            spaceId: meetingData.spaceId,
            status: 'Open'
        }
        // this.isMeetingOpen = true;
        // this.flagBtn = true
        this.docService.openMeeting(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
        this.snackbar.open('Meeting Open', 'Close', {
            duration: 3000,
            horizontalPosition: "center"
        });

        // 미팅 입장
        // this.enterMeeting();
    }

    // 호스트가 미팅을 닫는다 -> 실시간 회의만 불가능, 업로드 된 파일이나 기록 확인 가능
    closeMeeting(meetingData) {
        let data = {
            _id: meetingData._id,
            spaceId: meetingData.spaceId,
            status: 'Close'
        }
        // this.isMeetingOpen = true;
        // this.flagBtn = false;
        this.docService.closeMeeting(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
        this.snackbar.open('Meeting close', 'Close', {
            duration: 3000,
            horizontalPosition: "center",
            // verticalPosition: "top",
        });
    }
    enterMeeting(data) {
        // if( this.isMeetingOpen ) {
        window.open(this.API_URL + '/meeting/room/' + data._id);
        // }
        // else if( !this.isMeetingOpen ){
        //     this.dialogService.openDialogNegative('The meeting has not been held yet... Ask the host to open meeting ')
        // }
        // console.log(data)
        // this.docService.joinMeeting(data);
    }

    deleteMeeting(data) {
        // const data = this.data;
        console.log(data);
        this.dialogService.openDialogConfirm('Do you want to cancel the meeting?').subscribe(result => {
            if (result) {

                // meeting 삭제
                // meeting pdf 삭제
                this.docService.deleteMeetingPdfFile(data).subscribe((data: any) => {
                    // console.log(data)
                },
                    (err: any) => {
                        console.log(err);
                    }
                );

                // meeting안에 있는 채팅 삭제
                this.docService.deleteAllOfChat(data).subscribe((data: any) => {
                    // console.log(data)
                },
                    (err: any) => {
                        console.log(err);
                    }
                );

                // 미팅 삭제
                this.docService.deleteMeeting(data).subscribe(
                    (data: any) => {
                        console.log(data);
                        this.dialogService.openDialogPositive('Successfully, the meeting has been deleted.');
                        //   this.dialogRef.close();
                    },
                    (err: any) => {
                        console.log(err);
                    }
                )
            }
        });
    }
}


///////////////////////////////////////////////////////////
// 미팅 생성하는 dialog
@Component({
    selector: 'app-meeting-set',
    templateUrl: './dialog/meeting-set.html',
    styleUrls: ['./meeting-list.component.scss']
})
export class DialogMeetingSetComponent implements OnInit {

    today = new Date()
    // defaultHour: String = String(this.today.getHours() + 1);

    setMeetingForm = new FormGroup({
        startDate: new FormControl(this.today),
        meetingTitle: new FormControl(),
        meetingDescription: new FormControl(),
        startHour: new FormControl('12'),
        startMin: new FormControl('00'),
        startUnit: new FormControl('PM'),
    });


    hourList = [
        { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }, { value: '6' },
        { value: '7' }, { value: '8' }, { value: '9' }, { value: '10' }, { value: '11' }, { value: '12' },
    ];
    minList = [
        { value: '00' }, { value: '15' }, { value: '30' }, { value: '45' },
    ];
    timeUnit = [
        { value: 'PM' }, { value: 'AM' }
    ]

    spaceId;
    enlistedMember = [];
    enlistedMemberName = [];
    private unsubscribe$ = new Subject<void>();
    constructor(
        public dialogRef: MatDialogRef<DialogMeetingSetComponent>,
        private docService: DocumentService,
        private route: ActivatedRoute,
        private mdsService: MemberDataStorageService,
        private dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

        this.spaceId = data.spaceId
        console.log(data);
        console.log(this.spaceId);

        this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                // console.log(data);
                for (let index = 0; index < data[0].memberObjects.length; index++) {
                    this.enlistedMember.push(data[0].memberObjects[index]._id);
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        console.log(this.today.getHours() + 1)
    }


    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }

    // 미팅 만들기
    createMeeting() {

        this.dialogService.openDialogConfirm('Do you want to set up a meeting?').subscribe(result => {
            if (result) {

                // currentMember 만들기 -> 실시간 미팅에서 쓰임
                let currentMember = new Array();
                for (let index = 0; index < this.enlistedMember.length; index++) {
                    const element = {
                        member_id: this.enlistedMember[index],
                        role: 'Presenter',
                        online: false
                    }
                    currentMember.push(element);
                }

                const formValue = this.setMeetingForm.value;

                let setMeeting = {
                    spaceId: this.spaceId,
                    meetingTitle: formValue.meetingTitle,
                    meetingDescription: formValue.meetingDescription,
                    startDate: formValue.startDate,
                    startTime: formValue.startUnit + ' ' + formValue.startHour + ' : ' + formValue.startMin,
                    enlistedMembers: this.enlistedMember,
                    currentMembers: currentMember,
                    status: 'pending',
                }
                console.log(setMeeting);

                if (setMeeting.startDate == null || setMeeting.meetingTitle == null) {
                    this.dialogService.openDialogNegative('Please, check the meeting title and date.')
                    // alert('Please, check the meeting title and date.');
                }
                else {
                    this.docService.createMeeting(setMeeting).subscribe(
                        (data: any) => {
                            console.log(data);
                            this.dialogRef.close();
                            this.dialogService.openDialogPositive('Successfully, the meeting has been set up.');
                        },
                        (err: any) => {
                            console.log(err)
                        }
                    )
                }
            }
        });
    }

    // 달력 필터
    myFilter = (d: Date | null): boolean => {
        const day = (d || new Date()).getDay();
        // Prevent Saturday and Sunday from being selected.
        return day !== 0 && day !== 6;
    }
}