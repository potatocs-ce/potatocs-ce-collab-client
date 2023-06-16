import { Component, OnInit, OnChanges, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, HostBinding, Input, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NavigationDropdown, NavigationItem, NavigationLink } from '../interfaces/navigation-item.interface';
import { NavigationService } from 'src/@dw/services/navigation.service';

import { dropdownAnimation } from '../animations/dropdown.animation';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { SideNavService } from 'src/@dw/services/collab/side-nav/side-nav-service.service';
import { DialogCreateSpaceComponent } from 'src/@dw/dialog/create-space-dialog/dialog-create-space.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/@dw/store/data.service';
import { SpaceListStorageService } from '../store/space-list-storage.service';

/**
 * sidenav에서 각각의 개별 item에 대한 component
 * 대부분의 기능은 dropdown menu 처리를 위한 기능임
 *
 * [dropdown 동작 process]
 * 1. 내 dropdown 메뉴 외의 link에 접속한 상태
 *  - 기본은 close 상태
 *  - dropdown menu click시 open <-> close 반복
 *  - dropdown이 열린 상태에서 다른 routing으로 이동하면 close
 *  - dropdown내의 자식 routing으로 이동하면 open상태 유지 --> 2번
 *
 * 2. 내 dropdown 아래 자식 routing으로 접속한 상태
 *  - 기본은 open 상태
 *  - dropdown menu click시 open <-> close 반복
 *  - 자식 routing 내에서 이동시 open 상태 유지
 *  - 다른 link로 이동 시 dropdown close
 *
 * 3. 다른 dropdown 메뉴아래의 자식 routing으로 접속한 상태
 *  - 기본은 close 상태
 *  - 내 dropdown menu click시 open<-> close 반복 (기존 다른 dropdown menu도 open 상태)
 */

@Component({
  selector: 'po-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  animations: [dropdownAnimation],
  // https://medium.com/sjk5766/angular-change-detection-%EC%84%B1%EB%8A%A5-%ED%96%A5%EC%83%81%EB%B0%A9%EB%B2%95-onpush-changedetectionref-71c9bccf0a42
  // changeDetection: ChangeDetectionStrategy.OnPush // OnPush를 사용하면 cd.markForCheck()를 주석 해제 해야함.
})
export class SidenavItemComponent implements OnInit, OnChanges, OnDestroy {

  // @HostBinding('class')
  // https://angular.io/api/core/HostBinding
  // https://pub.dev/documentation/angular/latest/angular/HostBinding-class.html
  // https://stackoverflow.com/questions/34641281/how-to-add-class-to-host-element
  // host (po-sidenav-item)의 class에 item-level-1... 등의 class 추가 (drop down level)
  // getter를 사용하지 않으면 ngOnchanges에서 따로 level값에 따른 변화를 반영해야함 (여기서는 undefined)
  // https://stackoverflow.com/questions/44923564/conditional-hostbinding-depending-on-input
  @HostBinding('class')
  get levelClass() {
    return `item-level-${this.level}`;
  }

  @Input() item: NavigationItem;
  @Input() level: number;
  @Input() flag;

  isOpen: boolean; // dropdown menu가 열려있는지 여부
  isActive: boolean; // 연제 dropdown menu가 active한 상태(자식 item 중 active한 link가 있음)인지 여부
  // 주의: Active하지만 close된 dropdown menu 가능함. (active 상태에서 dropdown menu click)


  // service method 변수 설정 (본문 내에서 간략하게 사용)
  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  isCreateSpace = this.navigationService.isCreateSpace;

  subscriptions: Subscription;

  navItems
  folderList
  spaceFlag = {
    spaceFlag: 'collab'
  };

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private navigationService: NavigationService,
    private dialogService: DialogService,
    private sideNavService: SideNavService,
    public dialog2: MatDialog,
    private spaceListStorageService: SpaceListStorageService
  ) {

  }


  ngOnInit(): void {
    // console.log('[[ side nav item ]]', this.flag);
    this.subscriptions = new Subscription(); // for unsubscribe

    /*-----------------------------------------------------
     * dropdown menu에만 해당되는 subscription으로
     * if 문으로 dropdown인 경우만 subscription 하도록 변경함
    --------------------------------------------------------*/
    if (this.isDropdown(this.item)) {
      /*---------------------------------------
        1. router의 NavigationEnd event catch
        2. 현재 item이 drop down item인지 check
        3. onRouteChange 실행
        현재 menu가 dropdown인 경우만 영향있음.

        * 참고: 최초 event는 catch 안됨.
        (https://stackoverflow.com/questions/43237318/angular-2-router-event-not-firing-first-time)
      --------------------------------------------*/
      const sub1 = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => this.onRouteChange());

      /*--------------------------------------------
        Drop down menu의 변경 여부 (open <-> closed)
        현재 menu가 dropdown인 경우만 영향있음.
      ----------------------------------------------*/
      const sub2 = this.navigationService.openChange$.subscribe(item => this.onOpenChange(item));

      this.subscriptions.add(sub1).add(sub2);
    }
  }

  ngOnDestroy(): void {
    // unsbscribe all.
    this.subscriptions.unsubscribe();
  }

  /**
   * Input 값의 change event catch : Dropdown menu only.
   * - 실제로 중간에 변경되는 일은 없고, 최초 생성 시 dropdown menu 여부 check.
   * - 최초의 NavigationEnd 대신으로 사용???
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('item') && this.isDropdown(this.item)) { // this.item -> changes.item.currentValue로 해도 됩
      this.onRouteChange();
    }
  }

  /**
   * 현재 메뉴가 Dropdown menu인 경우
   * 클릭시 open <-> close 전환
   */
  toggleOpen() {
    console.log('1');
    this.isOpen = !this.isOpen;
    this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
    // this.cd.markForCheck(); // --> OnPush
  }

  /**
   * Dropdown [open <-> close] state (openChange$) 전환 발생에 따른 처리.
   * (다른 dropdown menu가 변경된 상태에도 들어옴)
   *
   * state 전환이 발생한 dropdown menu가 현재 자신인지 아닌지 check.
   * - 다른 dropdown 메뉴였다면 내 dropdown 메뉴는 close.
   * - (예외 1) 내 자식 dropdown 메뉴인 경우에는 현재 상태 유지
   * - (예외 2) 내 자식의 링크 중 하나가 active인 경우에는 현재 상태 유지
   * @param item NavigationDropdown
   */
  onOpenChange(item: NavigationDropdown) {

    // Dropdown 상태 변화가 발생한 item이 내 자식 (모든 하위 자식 포함)인 경우
    //   --> 현재 상태에서 변경할 필요 없음
    if (this.isChildrenOf(this.item as NavigationDropdown, item)) {
      return;
    }

    // 내 dropdown menu가 active한 child (Link)를 가지고 있는 경우
    //   --> 현재 상태에서 변경할 필요 없음
    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      return;
    }

    // 현재 내 dropdown에 대한 변경인 경우
    //   --> 현재 상태에서 변경할 필요 없음
    if (this.item === item) {
      return;
    }

    // 위 조건 통과 후
    // dropdown 상태 변화가 발생한 dropdown item이 내가 아니라면 isOpen = false로 설정
    // * 부모 dropdown이 닫히는 경우 자식도 닫히게 됨
    this.isOpen = false;
    // this.cd.markForCheck();

    // 원본
    // if (this.item !== item) {
    //   this.isOpen = false;
    //   this.cd.markForCheck();
    // }
  }

  /**
   * Route change가 발생한 경우.
   * - dropdown menu item인 경우에만 들어옴
   * - route 변경이 발생한 경우
   *   1. 하위 자식 중 active가 존재 (현재 routing에 해당) : dropdown 열기, Active 설정
   *   2. 하위 자식 중 active가 없음  : dropdown 닫기
   */
  onRouteChange() {
    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      // 내 하위 Menu에 active child가 있는 경우
      this.isActive = true;
      this.isOpen = true;
      this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
      // this.cd.markForCheck(); //--> 필요 없음..?
    } else {
      // 내 하위 Menu에 active child가 없는 경우
      this.isActive = false;
      this.isOpen = false;
      this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
      // this.cd.markForCheck(); //--> 필요 없음..?
    }
  }

  /**
   * dropdown state 변경이 발생한 item이 현재 dropdown menu의 child (하위 모두 포함)인가?
   *  --> ok : true 반환
   *  --> no : child의 child에 대해 recursion 수행.
   *
   * @param parent 현재 component에 해당하는  Dropdown menu item
   * @param item state 변경이 일어난 dropdown menu item
   */
  isChildrenOf(parent: NavigationDropdown, item: NavigationDropdown) {
    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    // 더 하위 child drop menu에 대한 check 수행.
    return parent.children
      .filter(child => this.isDropdown(child))
      .some(child => this.isChildrenOf(child as NavigationDropdown, item));
  }

  /**
   * 현재 dropdown item의 children 중에 Active한 child가 존재하는지 check
   * @param parent NavigationDropdown
   */
  hasActiveChilds(parent: NavigationDropdown) {
    return parent.children.some(child => {
      // drop down menu인 경우 recursive...
      // 현재 2중 dropdown menu는 없으므로 아래 루틴은 진입하지 않음.
      if (this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }

      if (this.isLink(child)) {
        // https://angular.io/api/router/Router
        // isActive(url: string | UrlTree, exact: boolean): boolean
        // TO CHECK : exact parameter 영향
        return this.router.isActive(child.route as string, false);
      }
    });
  }


  createSpaceDialog(): void {                                                                                                            
    console.log();
    const spaceDialogRef = this.dialog2.open(DialogCreateSpaceComponent, {

      // width: '270px',
      data: {
        spaceFlag: this.spaceFlag,
        spaceName: '',
        spaceBrief: '',
        folderList: this.folderList
      }
    });

    spaceDialogRef.afterClosed().subscribe(result => {
      console.log('The space dialog was closed');


      console.log(result);

      // console.log(result);
      if (result == null || result == '') {
        console.log('not data')
      }
      else {
        if (result.spaceFlag.spaceFlag == 'collab') {
          console.log('createSpace')
          this.createSpace(result);
        }
        else if (result.spaceFlag.spaceFlag == 'menuList') {
          console.log('updateSpacePlace')
          this.updateSpacePlace(result);
        }
      }
    });
  }
  createSpace(spaceData) {
    // console.log(spaceData);
    this.sideNavService.createSpace(spaceData).subscribe(
      (data: any) => {
        if (data.message = 'created') {
          this.dialogService.openDialogPositive('space created!');
          this.updateSideMenu();

        }
      },
      err => {
        console.log(err);
      }
    );
  }
  updateSideMenu() {
    this.sideNavService.updateSideMenu().subscribe(
      (data: any) => {
        // console.log(data);
        // console.log(data.navList);
        console.log('sidenav-item component');
        ///////////////
        const space = data.navList[0].spaces[data.navList[0].spaces.length - 1]
        console.log(space);
        this.navItems = this.navigationService.items;

        const element = {
          type: 'link',
          label: space.displayName,
          route: 'collab/space/' + space._id,
          isManager: false,
          isReplacementDay: false
        }
        this.navItems[1].children[1].children.push(element);
        this.spaceListStorageService.updateSpaceList(this.navItems);

        this.router.navigate(['/' + this.navItems[1].children[1].children[this.navItems[1].children[1].children.length - 1].route]);
        ///////////////

        const sideNavLists = {
          folder_list: data.navList[0].folders,
          space_list: data.navList[0].spaces
        }
        // this.sideNavService.setTrueForSideNavFlag();
        this.folderList = data.folderNav
        this.sideNavService.updateMenuData(sideNavLists);
      }
    );
  }
  updateSpacePlace(data) {
    this.sideNavService.updateSpacePlace(data).subscribe(
      (data: any) => {
        // console.log(data.message);
        if (data.message = 'update space place data') {
          this.dialogService.openDialogPositive('succeed move space');
          this.updateSideMenu();
        }
      },
      err => {
        console.log(err);
      }
    );

  }
}
