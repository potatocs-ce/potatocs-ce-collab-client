import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, take } from 'rxjs/operators';
import { animate, AnimationBuilder, style } from '@angular/animations';


@Injectable({
  providedIn: 'root'
})

/**
 * 초기 Landing 동작에서의 splash screen animated hide...
 */
export class SplashScreenService {

  splashScreenElem: HTMLElement;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private animationBuilder: AnimationBuilder) {

    // 어느걸로 해도됨.
    this.splashScreenElem = this.document.body.querySelector('#dw-splash-screen');
    // this.splashScreenElem = this.document.getElementById('po-splash-screen');
    // console.log(this.splashScreenElem);

    if (this.splashScreenElem) {
      this.router.events.pipe(
        // tap((e) => console.log(e)),
        //  https://stackoverflow.com/questions/50353164/angular-6-router-events-filter-filter-does-not-exist-on-type-observableevent
        // https://stackoverflow.com/questions/49722369/angular-router-events-navigationend-how-to-filter-only-the-last-event
        filter(event => event instanceof NavigationEnd),
        take(1)
      ).subscribe(() => this.hide());
    }
  }

  /**
   * animation & remove splash screen element
   */
  hide() {
    // https://angular.io/api/animations/AnimationBuilder
    const splashAnimation = this.animationBuilder.build([
      style({ opacity: 1 }),
      animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))
    ]);

    const player = splashAnimation.create(this.splashScreenElem);

    player.play();
    // remove() : https://developer.mozilla.org/ko/docs/Web/API/ChildNode/remove
    player.onDone(() => this.splashScreenElem.remove());
  }
}
