import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'po-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

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
  ) { }

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
    this.snackbar.open('Logout Goodbye ' + this.userProfileData.name, 'Close', {
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

    this.notificationStorageService.myNotificationData.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {

      // console.log(res)

      this.notiItems = res;
      let count = 0;
      for (let index = 0; index < this.notiItems.length; index++) {
        const element = this.notiItems[index].isRead;
        this.notiItems[index].period = moment(this.notiItems[index].createdAt).from(moment(today));
        if (element == false) {
          count++;
        }
      }
      this.notiItemsLength = count
    });
  }

  // notification 눌렀을때 이동
  // 
  moveToPage(item) {
    this.notificationService.editNotification(item).subscribe(
      (data: any) => {
        // console.log(data);
      }
    )
    // console.log(navi);
    this.router.navigate([item.navigate]);
  }

  // MARK ALL AS READ 눌렀을때
  allRead() {
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
