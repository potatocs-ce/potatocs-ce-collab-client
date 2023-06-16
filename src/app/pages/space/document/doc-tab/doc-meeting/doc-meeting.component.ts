import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ActivatedRoute } from '@angular/router';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { CommonService } from 'src/@dw/services/common/common.service';

//table page
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

// env
import { environment } from 'src/environments/environment';
import { MeetingDetailComponent } from '../../../meeting-list/meeting-detail/meeting-detail.component';
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';

//view table
export interface PeriodicElement {
    Meeting: String;
    Date: Date;
    // Time: String,
}

@Component({
    selector: 'app-doc-meeting',
    templateUrl: './doc-meeting.component.html',
    styleUrls: ['./doc-meeting.component.scss'],
})
export class DocMeetingComponent implements OnInit {

    private API_URL = environment.API_URL;

    mobileWidth: any;
    pageSize;
    pageSizeOptions;

    // 브라우저 크기 변화 체크 ///
    resizeObservable$: Observable<Event>
    resizeSubscription$: Subscription
    ///////////////////////
    pageEvent: PageEvent


    constructor(
        public dialog: MatDialog,
        private docService: DocumentService,
        private route: ActivatedRoute,
        private commonService: CommonService,
        private dialogService: DialogService,
        private meetingListStorageService: MeetingListStorageService
    ) { 

        this.onResize();

    }

    docId;
    meetingArray;
    spaceTime: any;
    displayedColumns: string[] = ['meetingTitle', 'start_date', 'start_time'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private unsubscribe$ = new Subject<void>();


    ////////////////////////////////////
    // 브라우저 크기
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.mobileWidth = window.innerWidth;

        // console.log(this.mobileWidth)

        if(this.mobileWidth <= 780) {
            this.pageSize = 5;
            this.pageSizeOptions = 5;
        } else {
            this.pageSize = 10;
            this.pageSizeOptions =10;
        }


        // console.log(this.pageSize)
    }
    ///////////////////////


    
    ngOnInit(): void {
        // this.spaceTime = this.route.snapshot.params.spaceTime;

        // this.route.queryParamMap.subscribe((params: any) => {
        //     this.docId = params.params.id;
        // });
        // // this.getMeetingList();

        // this.meetingListStorageService.meeting$.pipe(takeUntil(this.unsubscribe$)).subscribe(
        //     (data: any) => {
        //         this.meetingArray = data;
        //         this.meetingArray = new MatTableDataSource<PeriodicElement>(this.meetingArray);
        //         this.onResize();
        //         this.meetingArray.paginator = this.paginator;
        //     }
        // )


        // ////////////////////////////////////
        // this.mobileWidth = window.screen.width;
        // // 브라우저 크기 변화 체크
        // this.resizeObservable$ = fromEvent(window, 'resize')
        // this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
        //     // console.log('event: ', evt)
        // })
        // ////////////////////////////////////
        
    }
    ngOnDestroy() {
        // unsubscribe all subscription
        // this.unsubscribe$.next();
        // this.unsubscribe$.complete();
        // this.resizeSubscription$.unsubscribe()

    }

    openDialogDocMeetingSet() {
        // const dialogRef = this.dialog.open(DialogDocMeetingSetComponent, {});

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('dialog close');
        //     // this.getMeetingList();
        // });
    }

    // 미팅 디테일 오픈
    // openDialogMeetingDetail(data) {

    //     const dialogRef = this.dialog.open(MeetingDetailComponent, {

    //         data: {
    //             _id: data._id,
    //             docId: data.docId,
    //             meetingTitle: data.meetingTitle,
    //             manager: data.manager,
    //             createdAt: data.createdAt,
    //             enlistedMembers: data.enlistedMembers,
    //             // isDone: false,
    //             start_date: data.start_date,
    //             start_time: data.start_time,
    //             status: data.status,
    //             space_id: this.spaceTime,
    //         }
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('dialog close');
    //         // this.getMeetingList();
    //     });
    // }

    // 미팅 리스트 가져오기
    // getMeetingList() {
    //     let data = {
    //         docId: this.docId,
    //     };
    //     this.docService.getMeetingList(data).subscribe(
    //         (data: any) => {

    //         },
    //         (err: any) => {
    //             console.log(err);
    //         },
    //     );
    // }


    // joinMeeting(data) {
    //   // console.log(data)
    //   window.open(this.API_URL + '/meeting/room/' + data._id);
    //   // this.docService.joinMeeting(data);
    // }

    // 미팅 삭제
    // deleteMeeting(data) {
    //   console.log(data);
    //   // const result = confirm('미팅을 삭제하시겠습니까?');
    //   // if (result) {
    //   this.dialogService.openDialogConfirm('Do you want to delete the meeting?').subscribe(result => {
    //     if (result) {

    //       // meeting 삭제
    //       // meeting pdf 삭제
    //       this.docService.deleteMeetingPdfFile(data).subscribe((data: any) => {
    //         // console.log(data)
    //       },
    //         (err: any) => {
    //           console.log(err);
    //         }
    //       );

    //       // meeting안에 있는 채팅 삭제
    //       this.docService.deleteAllOfChat(data).subscribe((data: any) => {
    //         // console.log(data)
    //       },
    //         (err: any) => {
    //           console.log(err);
    //         }
    //       );

    //       // 미팅 삭제
    //       this.docService.deleteMeeting(data).subscribe(
    //         (data: any) => {
    //           console.log(data);
    //           this.getMeetingList();
    //           this.dialogService.openDialogPositive('Successfully,the meeting has been deleted.');
    //         },
    //         (err: any) => {
    //           console.log(err);
    //         }
    //       )
    //     }
    //   });
    // }
}

///////////////////////////////////////////////////////////////////
// 22.04.08 meeting 이 document 에서 space 로 이동됨
// 주석 처리

// @Component({
//     selector: 'app-doc-meeting-set',
//     templateUrl: './dialog/doc-meeting-set.html',
//     styleUrls: ['./doc-meeting.component.scss']
// })
// export class DialogDocMeetingSetComponent implements OnInit {

//     today = new Date()
//     // defaultHour: String = String(this.today.getHours() + 1);

//     setMeetingForm = new FormGroup({
//         startDate: new FormControl(this.today),
//         meetingTitle: new FormControl(),
//         startHour: new FormControl('12'),
//         startMin: new FormControl('00'),
//         startUnit: new FormControl('PM'),
//     });


//     hourList = [
//         { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }, { value: '6' },
//         { value: '7' }, { value: '8' }, { value: '9' }, { value: '10' }, { value: '11' }, { value: '12' },
//     ];
//     minList = [
//         { value: '00' }, { value: '15' }, { value: '30' }, { value: '45' },
//     ];
//     timeUnit = [
//         { value: 'PM' }, { value: 'AM' }
//     ]



//     docId;
//     enlistedMember = [];
//     enlistedMemberName = [];
//     private unsubscribe$ = new Subject<void>();
//     constructor(
//         public dialogRef: MatDialogRef<DialogDocMeetingSetComponent>,
//         private docService: DocumentService,
//         private route: ActivatedRoute,
//         private mdsService: MemberDataStorageService,
//         private dialogService: DialogService
//     ) {
//         // docid 가져오기
//         this.route.queryParamMap
//             .subscribe(
//                 (params: any) => {
//                     this.docId = params.params.id;
//                 }
//             );

//         this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
//             (data: any) => {
//                 // console.log(data);
//                 for (let index = 0; index < data[0].memberObjects.length; index++) {
//                     this.enlistedMember.push(data[0].memberObjects[index]._id);
//                 }
//             },
//             (err: any) => {
//                 console.log(err);
//             }
//         );
//     }

//     ngOnInit(): void {
//         console.log(this.today.getHours() + 1)
//     }


//     ngOnDestroy() {
//         // unsubscribe all subscription
//         this.unsubscribe$.next();
//         this.unsubscribe$.complete();

//     }


//     // 미팅 만들기
//     createMeeting() {

//         this.dialogService.openDialogConfirm('Do you want to set up a meeting?').subscribe(result => {
//             if (result) {

//                 // currentMember 만들기 -> 실시간 미팅에서 쓰임
//                 let currentMember = new Array();
//                 for (let index = 0; index < this.enlistedMember.length; index++) {
//                     const element = {
//                         member_id: this.enlistedMember[index],
//                         role: 'Presenter',
//                         online: false
//                     }
//                     currentMember.push(element);
//                 }

//                 const formValue = this.setMeetingForm.value;

//                 let setMeeting = {
//                     docId: this.docId,
//                     meetingTitle: formValue.meetingTitle,
//                     startDate: formValue.startDate,
//                     startTime: formValue.startUnit + ' ' + formValue.startHour + ' : ' + formValue.startMin,
//                     enlistedMembers: this.enlistedMember,
//                     currentMembers: currentMember,
//                     status: 'pending',
//                 }
//                 console.log(setMeeting);

//                 if (setMeeting.startDate == null || setMeeting.meetingTitle == null) {
//                     this.dialogService.openDialogNegative('Please, check the meeting title and date.')
//                     // alert('Please, check the meeting title and date.');
//                 }
//                 else {
//                     this.docService.createMeeting(setMeeting).subscribe(
//                         (data: any) => {
//                             console.log(data);
//                             this.dialogRef.close();
//                             this.dialogService.openDialogPositive('Successfully, the meeting has been set up.');
//                         },
//                         (err: any) => {
//                             console.log(err)
//                         }
//                     )
//                 }
//             }
//         });
//     }
//     // 달력 필터
//     myFilter = (d: Date | null): boolean => {
//         const day = (d || new Date()).getDay();
//         // Prevent Saturday and Sunday from being selected.
//         return day !== 0 && day !== 6;
//     }
// }
