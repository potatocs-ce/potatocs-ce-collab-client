import { Injectable } from '@angular/core';
import { NavigationSubheading, NavigationDropdown, NavigationLink, NavigationItem, NavigationCreatSpace } from '../interfaces/navigation-item.interface';
import { Subject } from 'rxjs';

import { sidenavRouteInfo } from '../config/sidenav-route-info';


/**
 * Navigation route 정보관련 service
 * - dropdown menu의 상태 저장
 * - route의 종류 check
 * - Link / DropDown / Subheading
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  items: NavigationItem[] = sidenavRouteInfo; // sidenav menu item

  private _openChangeSubject = new Subject<NavigationDropdown>();
  openChange$ = this._openChangeSubject.asObservable();

  constructor() { }

  /**
   * Dropdown menu 클릭이 발생한 item 전달
   * @param item NavigationDropdown
   */
  triggerOpenChange(item: NavigationDropdown) {
    this._openChangeSubject.next(item);
  }

  /*-----------------------------------------------------------------------------------------
    kje : type guard, type predicate -> item is NavigationLink
    https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
    https://velog.io/@zeros0623/TypeScript-%EA%B3%A0%EA%B8%89-%ED%83%80%EC%9E%85
    https://typescript-kr.github.io/pages/Advanced%20Types.html

    ex) 아래 item is... 부분을 제거하면 sidenav-item.component.html에서 type error 발생함
  --------------------------------------------------------------------------------------------*/

  /**
   * 현재 Menu가 Link에 해당하는지 check
   * @param item Navigation Item
   */
  isLink(item: NavigationItem): item is NavigationLink {
    return item.type === 'link';
  }

  /**
   * 현재 menu가 dropdown menu인지 check
   * @param item Navigation Item
   */
  isDropdown(item: NavigationItem): item is NavigationDropdown {
    return item.type === 'dropdown';
  }

  /**
   * 현재 menu가 Subheading인지 check
   * @param item Navigation Item
   */
  isSubheading(item: NavigationItem): item is NavigationSubheading {
    return item.type === 'subheading';
  }

  /**
   * 현재 menu가 Subheading인지 check
   * @param item Navigation Item
   */
   isCreateSpace(item: NavigationItem): item is NavigationCreatSpace {
    return item.type === 'click';
  }
}
