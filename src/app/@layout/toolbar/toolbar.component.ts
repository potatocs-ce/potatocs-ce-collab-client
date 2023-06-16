import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../@dw/services/layout.service';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/@dw/services/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/@dw/services/user/profile.service';
import { DataService } from 'src/@dw/store/data.service';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/@dw/services/notification/notification.service';
import { NotificationStorageService } from 'src/@dw/store/notification-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
    selector: 'po-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
    userProfileData;
    notiItems = [];
    notiItemsLength = 0;
    profileImg;

    private unsubscribe$ = new Subject<void>();

    constructor(
        private layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private profileService: ProfileService,
        private dataService: DataService,
        private notificationService: NotificationService,
        private notificationStorageService: NotificationStorageService,
        private snackbar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.profileService.getUserProfile().subscribe((data: any) => {
            if (data.result) {
                // console.log(data.user.profile_img);
                this.profileImg = data.user.profile_img;
            }
        });

        this.notificationService.getNotification().subscribe(
            (data: any) => {
                if (data.result) {
                }
            }
        )

        this.getUserProfileData();
        this.getNotificationData();
    }
    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    logOut() {
        // console.log('logout');
        this.authService.logOut();
        this.snackbar.open('Logout Goodbye ' + this.userProfileData.name,'Close' ,{
            duration: 3000,
            horizontalPosition: "center"
        });
        this.router.navigate(['welcome']);
    }

    getUserProfileData() {
        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
            this.userProfileData = res;
        });
    }

    // notification 가져오기
    getNotificationData() {
        const today = new Date();

        this.notificationStorageService.myNotificationData.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) =>{

            // console.log(res)

            this.notiItems = res;
            let count = 0;
            for (let index = 0; index < this.notiItems.length; index++) {
                const element = this.notiItems[index].isRead;
                this.notiItems[index].period = moment(this.notiItems[index].createdAt).from(moment(today));
                if(element == false){
                    count++;
                }
            }
            this.notiItemsLength = count
        });
    }

    // notification 눌렀을때 이동
    // 
    moveToPage(item){
        this.notificationService.editNotification(item).subscribe(
            (data: any) => {
                // console.log(data);
            }
        )
        // console.log(navi);
        this.router.navigate([item.navigate]);
    }

    // MARK ALL AS READ 눌렀을때
    allRead(){
        this.notificationService.allReadNotification().subscribe(
            (data: any) => {
                
            }
        )
    }


    /**
     * open side nav
     */
    openSidenav() {
        this.layoutService.openSidenav();
    }
}
