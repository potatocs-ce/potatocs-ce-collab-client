import { Component, OnInit } from '@angular/core';
import { SideNavService } from 'src/@dw/services/collab/side-nav/side-nav-service.service';
import { DataService } from 'src/@dw/store/data.service';
import { NavigationService } from 'src/@dw/services/navigation.service';
import { SpaceListStorageService } from '../../../@dw/store/space-list-storage.service';
import { Router } from '@angular/router';
@Component({
    selector: 'po-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    navItems;
    user;
    rd;
    flag = {
        isReplacementDay : null,
        isManager: null,
    };

    constructor(
        private router: Router,
        private navigationService: NavigationService,
        private sideNavService: SideNavService,
        private dataService: DataService,
        private spaceListStorageService: SpaceListStorageService
    ) { }

    ngOnInit(): void {

        this.sideNavService.updateSideMenu().subscribe(
            (data: any) => {

                this.dataService.userCompanyProfile.subscribe(
                    (data: any) => {
                        // console.log(data);
                        if(data == null || data.isReplacementDay == undefined){
                            this.rd = false;
                        }
                        else{
                            this.rd = data.isReplacementDay;
                        }
                        // console.log('22',this.rd);
                        this.flag.isReplacementDay = this.rd;
                        // console.log(this.flag);
                    }
                )
                this.dataService.userProfile.subscribe(
                    (data: any) => {
                        this.user = data.isManager;
                        // console.log('11', this.user);
                        this.flag.isManager = data.isManager;
                        
                    }
                );
                
                

                const space = data.navList[0].spaces
                // console.log('sidenav component');
                // console.log(space);
                this.navItems = this.navigationService.items;

                this.navItems[1].children[1].children = [];
                for (let index = 0; index < space.length; index++) {
                    const element = {
                        type: 'link',
                        label: space[index].displayName,
                        route: 'collab/space/' + space[index]._id,
                        isManager: false,
                        isReplacementDay: false
                    }
                    this.navItems[1].children[1].children.push(element);
                }
                this.spaceListStorageService.updateSpaceList(this.navItems);
            },
            (err: any) => {
                console.log('sideNavService error', err);
            }
        );
    }



    main() {
		this.router.navigate(['main']);
	}
}
