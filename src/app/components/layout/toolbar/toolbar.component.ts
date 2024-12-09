import { DialogService } from "./../../../stores/dialog/dialog.service";
import { ProfilesService } from "./../../../services/profiles/profiles.service";
import { AuthService } from "./../../../services/auth/auth.service";
import { Component, WritableSignal, effect, inject } from "@angular/core";
import { MaterialsModule } from "../../../materials/materials.module";
import { SideNavService } from "../../../stores/side-nav/side-nav.service";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-toolbar",
	standalone: true,
	imports: [MaterialsModule, CommonModule, RouterLink],
	templateUrl: "./toolbar.component.html",
	styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {
	notiItems = [
		{
			notiType: "leave-request",
			isRead: false,
			iconText: "open_in_browser",
			notiLabel: "A new leave request received",
		},
		{
			notiType: "company-request",
			isRead: false,
			iconText: "work_outline",
			notiLabel: "A new company request received",
		},
		{
			notiType: "company-res-y",
			isRead: false,
			iconText: "done_outline",
			notiLabel: "The company request has been accepted",
		},
		{
			notiType: "leave-res-n",
			isRead: false,
			iconText: "block",
			notiLabel: "The leave request has been rejected",
		},
		{
			notiType: "company-res-n",
			isRead: false,
			iconText: "block",
			notiLabel: "The company request has been rejected",
		},
		{
			notiType: "leave-request",
			isRead: false,
			iconText: "open_in_browser",
			notiLabel: "A new leave request received",
		},
		{
			notiType: "leave-res-y",
			isRead: false,
			iconText: "done_outline",
			notiLabel: "A new leave request has been accepted",
		},
		{
			notiType: "leave-request",
			isRead: false,
			iconText: "open_in_browser",
			notiLabel: "A new leave request received",
		},
		{
			notiType: "leave-request",
			isRead: false,
			iconText: "open_in_browser",
			notiLabel: "A new leave request received",
		},
		{
			notiType: "leave-request",
			isRead: false,
			iconText: "open_in_browser",
			notiLabel: "A new leave request received",
		},
	];

	dialogService = inject(DialogService);
	router = inject(Router);
	sideNavService = inject(SideNavService);
	authService = inject(AuthService);
	profilesService = inject(ProfilesService);
	// 시그널 변수 선언
	isSideNavOpen: WritableSignal<boolean> = this.sideNavService.isSideNavOpen;
	isDesktop: WritableSignal<boolean> = this.sideNavService.isDesktop;
	// userInfo: WritableSignal<any | null> = this.authService.userInfo;

	userProfileInfo: WritableSignal<any | null> = this.profilesService.userProfileInfo;

	constructor(private snackbar: MatSnackBar) {
		effect(() => {
			console.log(this.userProfileInfo());
		});
	}

	ngOnInit() {
		this.profilesService.getUserProfile().subscribe({
			next: (res: any) => {
				console.log(res);
			},
			error: (err: any) => {
				console.log(err);
				this.dialogService.openDialogNegative("Internet Server Error");
			},
		});
	}

	openSidenav() {
		this.isSideNavOpen.update(() => true);
	}

	logOut() {
		this.authService.logOut();
		this.snackbar.open("Logout Goodbye " + this.userProfileInfo().name, "Close", {
			duration: 3000,
			horizontalPosition: "center",
		});
		this.router.navigate(["sign-in"]);
	}
}
