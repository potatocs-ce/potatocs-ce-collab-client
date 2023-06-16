import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/@dw/services/auth/auth.service';
import { DataService } from 'src/@dw/store/data.service';
import { ProfileService } from 'src/@dw/services/user/profile.service';


import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from '../../../@dw/services/layout.service';
import { NavigationService } from 'src/@dw/services/navigation.service';


export interface NavItem {
	displayName: string;
	disabled?: boolean;
	iconName: string;
	route?: string;
	children?: NavItem[];
}

@Component({
	selector: 'app-leave-mngmt',
	templateUrl: './leave-mngmt.component.html',
	styleUrls: ['./leave-mngmt.component.scss']
})
export class LeaveMngmtComponent implements OnInit {


	isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
	subscriptions: Subscription;

	@ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

	userProfileData;
	@ViewChild('appDrawer') appDrawer: ElementRef;
	public isActive: boolean = false;


	notiItems = [
		{
			notiType: 'leave-request',
			isRead: false,
			iconText: 'open_in_browser',
			notiLabel: 'A new leave request received'
		},
		{
			notiType: 'company-request',
			isRead: false,
			iconText: 'work_outline',
			notiLabel: 'A new company request received'
		},
		{
			notiType: 'company-res-y',
			isRead: false,
			iconText: 'done_outline',
			notiLabel: 'The company request has been accepted'
		},
		{
			notiType: 'leave-res-n',
			isRead: false,
			iconText: 'block',
			notiLabel: 'The leave request has been rejected'
		},
		{
			notiType: 'company-res-n',
			isRead: false,
			iconText: 'block',
			notiLabel: 'The company request has been rejected'
		},
		{
			notiType: 'leave-request',
			isRead: false,
			iconText: 'open_in_browser',
			notiLabel: 'A new leave request received'
		},
		{
			notiType: 'leave-res-y',
			isRead: false,
			iconText: 'done_outline',
			notiLabel: 'A new leave request has been accepted'
		},
		{
			notiType: 'leave-request',
			isRead: false,
			iconText: 'open_in_browser',
			notiLabel: 'A new leave request received'
		},
		{
			notiType: 'leave-request',
			isRead: false,
			iconText: 'open_in_browser',
			notiLabel: 'A new leave request received'
		},
		{
			notiType: 'leave-request',
			isRead: false,
			iconText: 'open_in_browser',
			notiLabel: 'A new leave request received'
		}
	]

	navItems = this.navigationService.items;
	constructor(
		private authService: AuthService,
		private router: Router,
		private profileService: ProfileService,
		private dataService: DataService,
		private layoutService: LayoutService,
		private navigationService: NavigationService
	) { }

	ngOnInit(): void {
		this.profileService.getUserProfile().subscribe(
			(data: any) => {
				if (data.result) {
					this.getUserProfileData();
				}
			}
		);
	}

	logOut() {
		this.authService.logOut();
		this.router.navigate(['']);
	}

	getUserProfileData() {
		this.dataService.userProfile.subscribe(
			(res: any) => {
				this.userProfileData = res;
			}
		);
	}

}
