import { inject } from '@angular/core';
import {
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateFn,
} from '@angular/router';
import { DialogService } from '../stores/dialog/dialog.service';
import { SideNavService } from '../stores/side-nav/side-nav.service';

export const SpaceGuard: CanActivateFn = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const dialogService = inject(DialogService);
    const router = inject(Router);
    const sidenavService = inject(SideNavService);
    const spaces: any = await sidenavService.updateSideMenu().toPromise();
    let spaceTime = ''

    // create doc 할 때는 param 말고 queryParams 로 받아야해서 코드 수정
    if (route.params['spaceTime']) {
        spaceTime = route.params['spaceTime'];
    }
    else {
        spaceTime = route.queryParams['spaceTime']
    }

    let spaceInfo = spaces.navList[0].spaces;
    let flag = false;
    console.log('spaceTime : ', spaceTime);
    for (let index = 0; index < spaceInfo.length; index++) {
        const element = spaceInfo[index]._id;
        if (spaceTime == element) {
            flag = true;
            break;
        } else {
            flag = false;
        }
    }

    if (flag) {
        return true;
    } else {
        dialogService.openDialogNegative(
            'You are not a member of this space or document.'
        );
        router.navigate(['/main']);
    }
    return false;
};
