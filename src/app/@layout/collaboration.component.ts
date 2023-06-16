import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';

import { MatSidenav } from '@angular/material/sidenav';

import { LayoutService } from '../../@dw/services/layout.service';
import { NavigationService } from 'src/@dw/services/navigation.service';
@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.scss']
})
export class CollaborationComponent implements OnInit, OnDestroy {

  // DESKTOP 기준 : 현재 1280px로 설정
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  subscriptions: Subscription;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;



  userProfileData;
  @ViewChild('appDrawer') appDrawer: ElementRef;
  public isActive: boolean = false;


  notiItems = [
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received'
    },
    {
      notiType: 'company-request',
      isRead: false,
      iconText: 'work_outline',
      notiLabel: 'A new company request received'
    },
    {
      notiType: 'company-res-y',
      isRead: false,
      iconText: 'done_outline',
      notiLabel: 'The company request has been accepted'
    },
    {
      notiType: 'leave-res-n',
      isRead: false,
      iconText: 'block',
      notiLabel: 'The leave request has been rejected'
    },
    {
      notiType: 'company-res-n',
      isRead: false,
      iconText: 'block',
      notiLabel: 'The company request has been rejected'
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received'
    },
    {
      notiType: 'leave-res-y',
      isRead: false,
      iconText: 'done_outline',
      notiLabel: 'A new leave request has been accepted'
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received'
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received'
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received'
    }
  ]
  
  navItems = this.navigationService.items;
  
  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {

    /*-----------------------------------------
        Desktop이 아닌 경우에 대한 side menu 처리.
      ------------------------------------------*/

    // 1. 상단 햄버거 메뉴 클릭시 sidenav(메뉴) open.
    // open 상태만 check.
    const sub1 = this.layoutService.sidenavOpen$.pipe(
      filter(open => open === true)
    ).subscribe((open) => this.sidenav.open());

    /*--------------------------------------------------------------------
      2. Desktop이 아닌 경우, navigation 이동 종료 후 sidenav 자동으로 close
      --> 모바일에서는 상단 버튼 클릭 => 메뉴 open => 페이지이동 => 메뉴 close
      isDeskop$은 behaviour subject를 사용하지 않으므로 withLatestFrom 사용.
      https://rxjs-dev.firebaseapp.com/api/operators/withLatestFrom
    ---------------------------------------------------------------------*/
    const sub2 = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      withLatestFrom(this.isDesktop$), // isDesktop$을 같이 참조
      filter(([event, isDesktop]) => !isDesktop), // desktop이 아닌 상태에서만 넘어가도록 설정
    ).subscribe(() => this.sidenav.close());


    this.subscriptions = new Subscription(); // for unsubscribe
    this.subscriptions.add(sub1).add(sub2);



    // 처음에는 router event는 안들어옴 (component 생성전?) --> startWith를 이용. url check 가능한 듯.
    // Initial Router Test
    // https://stackoverflow.com/questions/43237318/angular-2-router-event-not-firing-first-time
    // this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationEnd),
    //     startWith(this.router)
    //   )
    //   .subscribe((event: NavigationEnd) => {
    //     // there will be first router.url - and next - router events
    //     console.log(event.url); // .RouterState.snapshot.url

    //   });
    
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
    this.subscriptions.unsubscribe();
  }

}
