import { MaterialsModule } from "../../../materials/materials.module";
import { CommonModule } from "@angular/common";
import { SideNavItemComponent } from "../side-nav-item/side-nav-item.component";
import { sidenavRouteInfo } from "../../../config/sidenav-route-info";
import { NavigationItem } from "../../../interfaces/navigation-item.interface";
import { RouterModule } from "@angular/router";
import { SideNavService } from "../../../stores/side-nav/side-nav.service";
import { ProfilesService } from "../../../services/profiles/profiles.service";
import { Component, HostBinding, Input, SimpleChanges, WritableSignal, inject, effect } from "@angular/core";
import { NavigationService } from "../../../stores/navigation/navigation.service";
import { SpacesService } from "../../../services/spaces/spaces.service";
import { SpaceListStorageService } from "../../../stores/space-list-storage.service";

@Component({
    selector: "app-side-nav",
    standalone: true,
    imports: [MaterialsModule, CommonModule, SideNavItemComponent, RouterModule],
    templateUrl: "./side-nav.component.html",
    styleUrl: "./side-nav.component.scss",
})
export class SideNavComponent {
    navItems: any[] = sidenavRouteInfo;

    // 의존성 주입
    profilesService = inject(ProfilesService);
    spacesService = inject(SpacesService);

    userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
    userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo;
    space: WritableSignal<any> = this.spaceListStorageService.space;

    constructor(
        private sideNavService: SideNavService,
        private navigationService: NavigationService,
        private spaceListStorageService: SpaceListStorageService
    ) {
        effect(() => {
            console.log(this.space());
        });
    }
    ngOnInit(): void {
        this.sideNavService.updateSideMenu().subscribe(
            (data: any) => {
                const space = data.navList[0].spaces;
                this.navItems[1].children[1].children = [];
                for (let index = 0; index < space.length; index++) {
                    const element = {
                        type: "link",
                        label: space[index].displayName,
                        route: "space/" + space[index]._id,
                        isManager: false,
                        isReplacementDay: false,
                        faceAuthentication: 'faceAuthentication' in space[index] ? space[index].faceAuthentication : false
                    };
                    this.navItems[1].children[1].children.push(element);
                }
                console.log('space set')
                this.spaceListStorageService.space.set(this.navItems);
            },
            (err: any) => {
                console.log("sideNavService error", err);
            }
        );
    }
}
