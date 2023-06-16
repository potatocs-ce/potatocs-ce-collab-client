import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { DialogService } from '../../../dialog/dialog.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MngGuard implements CanActivate, OnInit {

    constructor(
        private router: Router,
        private auth: AuthService,
        private dialogService: DialogService,
    ) {

    }

    ngOnInit() {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const managerFlag: boolean = this.auth.getTokenInfo().isManager;
        
        if (!managerFlag) {
            this.dialogService.openDialogNegative('You are not a manager');
            this.router.navigate(['main']);
        }
        else{
            return true;      
        }
    }
}
