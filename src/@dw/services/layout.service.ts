import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'; // https://material.angular.io/cdk/layout/overview
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public isDesktop$: Observable<boolean>;

  private _sidenavOpen$ = new BehaviorSubject<boolean>(false);
  public sidenavOpen$ = this._sidenavOpen$.asObservable();



  constructor(
    private breakpointObserver: BreakpointObserver
  ) {

    // check Desktop for side menu --> 그냥 service 내에서 정의해서 사용
    // Breakingpoints  -> not documented:
    // http://www.darkhelm.org/2018/11/angular-material-breakpoints-details.html
    // https://stackblitz.com/edit/detecting-breakpoints
    // @vex 참조
    this.isDesktop$ = this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge]) // 현재 1280px 기준
      .pipe(
        map((state: BreakpointState) => state.matches),
        shareReplay(), // HTML template 내의 여러 isDesktop$ 호출에 대해 1회만 실행
        distinctUntilChanged()
      );
  }


  openSidenav() {
    this._sidenavOpen$.next(true);
  }

}
