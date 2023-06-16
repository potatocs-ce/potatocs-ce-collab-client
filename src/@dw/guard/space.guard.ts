import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DialogService } from '../dialog/dialog.service';
import { AuthService } from '../services/auth/auth.service';
import { SideNavService } from '../services/collab/side-nav/side-nav-service.service';
import { MemberDataStorageService } from '../store/member-data-storage.service';
import { SpaceListStorageService } from '../store/space-list-storage.service';

@Injectable()
export class SpaceGuard implements CanActivate, OnInit {

    userId;
    space;
    flag: boolean;

    constructor(
        private router: Router,
        private auth: AuthService,
        private dialogService: DialogService,
        private memberDataStorageService: MemberDataStorageService,
        private spaceListStorageService: SpaceListStorageService,
        private sideNavService: SideNavService
    ) {

    }

    ngOnInit() {
        console.log('auth guard oninit');
        
    }
    // https://stackoverflow.com/questions/42719445/pass-parameter-into-route-guard
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.flag = true;
        const spaceTime = route.params.spaceTime;
        this.userId = this.auth.getTokenInfo()._id;

        const spaceList:any = await this.sideNavService.updateSideMenu().toPromise();

        this.space = spaceList.navList[0].spaces;
        
        for (let index = 0; index < this.space.length; index++) {
            const element = this.space[index]._id;
            if(spaceTime == element){
                this.flag = true;
                break;
            }
            else{
                this.flag = false;
            }
            
        }
        
        if(!this.flag){
            // console.log('undefined');
            this.dialogService.openDialogNegative('You are not a member of this space or document.');
            this.router.navigate(['/main']);
        }
        else{
            return this.flag;
        }
    }
}
