import { NavigationService } from './../../stores/navigation/navigation.service';
import { Component, DestroyRef, ElementRef, HostListener, ViewChild, effect, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from '../../stores/side-nav/side-nav.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialsModule } from '../../materials/materials.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialsModule, SideNavComponent, ToolbarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  @ViewChild('appDrawer') appDrawer!: ElementRef;


  private sidenavService = inject(SideNavService);
  isDesktop = this.sidenavService.isDesktop;

  isSideNavOpen = this.sidenavService.isSideNavOpen;
  private navigationService = inject(NavigationService);
  navItems = this.navigationService.navItems;

  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  constructor(
  ) {

    /**
     * 1. 상단 햄버거 매뉴 클릭 시 사이드바가 나옴
     * this.isSideNavOpen()가 true면 실행
     */
    effect(() => {
      this.isSideNavOpen() ? this.sidenav.open() : this.sidenav.close();
    });


    /**
   * 데스크탑 모드가 아닐 경우
   * 햄버거에서 사이드바를 열고 다른 페이지로 이동하면
   * 사이드 바를 자동으로 닫음
   */
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && !this.isDesktop()),
      // isDesktop$을 같이 참조
      // desktop이 아닌 상태에서만 넘어가도록 설정
    ).subscribe(() =>
      this.closeEvent()
    );
  }

  /**
 * @description 화면의 사이즈 변화를 감지하여 side nav 상태 변경
 * @param event 이벤트 파라미터
 */
  @HostListener('window:resize', ['$event'])
  onResize() {
    // this.isDesktop.update(() => window.innerWidth > 1440);
    this.isDesktop.update(() => window.innerWidth > 1280);
  }

  closeEvent() {
    console.log('close')
    this.sidenav.close()
    this.isSideNavOpen.update(() => false);
  }

}
