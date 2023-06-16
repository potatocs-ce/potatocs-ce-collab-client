import { Component } from '@angular/core';
import { SplashScreenService } from 'src/@dw/services/splash-screen.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'client';

    constructor(
        private splashScreenService: SplashScreenService) {
    }
}
