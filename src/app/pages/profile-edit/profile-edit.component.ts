import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { DataService } from 'src/@dw/store/data.service';
import { ProfileService } from 'src/@dw/services/user/profile.service';

@Component({
	selector: 'app-profile-edit',
	templateUrl: './profile-edit.component.html',
	styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

	public userInfo;
	public info = {
		_id: '',
		name: '',
		new_password: '',
		confirm_password: '',
		mobile: '',
		department: '',
		position: '',
	}

	public flag = {
		nameFlag: true,
		passwordFlag: true,
		emailFlag: true,
		mobileFlag: true,
		departmentFlag: true,
		positionFlag: true,
	}

	constructor(
		private profileService: ProfileService,
		private dataService: DataService,
		private dialogService: DialogService
	) {
	}

	ngOnInit(): void {

		this.dataService.userProfile.subscribe(
			(data: any) => {
				this.userInfo = data;

				this.info._id = this.userInfo._id;
				this.info.name = this.userInfo.name;
				this.info.mobile = this.userInfo.mobile;
				this.info.department = this.userInfo.department;
				this.info.position = this.userInfo.position;
			}
			, (err: any) => {
				console.log(err);
			}
		)
	}

	onEdit(flagName) {
		this.flag[flagName] = false;
		// const Name = flagName.slice(0,-4);

	}
	onCanel(flagName) {
		this.flag[flagName] = true;
		console.log(this.info)
		const Name = flagName.slice(0, -4);
		this.info[Name] = this.userInfo[Name];
	}
	onSave(flagName) {

		// console.log(this.info);
		this.flag[flagName] = true;
		const Name = flagName.slice(0, -4);
		// const res = confirm('Do you want to save?');
		// if(res) {
		this.dialogService.openDialogConfirm('Do you want to save?').subscribe(result => {
			if (result) {

				if (Name == 'password') {
					if (this.info.new_password.length < 4) {
						return this.dialogService.openDialogNegative('The password must be at least 4 letters.');
						// return alert('The password must be at least 4 letters.');
					}

					const isPwd = this.comparePwdEachOther(this.info.new_password, this.info.confirm_password)

					if (!isPwd) {
						this.resetPwdInit();
						return this.dialogService.openDialogNegative('Two passwords are different. Try again.');
						// return alert('Two passwords are different. Try again.');
					}
				}

				this.profileService.changeUserProfile(this.info).subscribe(
					(data: any) => {
						console.log(data);
						// console.log(data.profileChange);
						if (data.message == 'changed') {
							this.dialogService.openDialogPositive(`${Name} has updated successfully.`);
							// alert(`${Name} has updated successfully.`);
							this.dataService.updateUserProfile(data.profileChange);
							this.resetPwdInit();
						}
					}
					, (err: any) => {
						console.log(err);
						this.resetPwdInit();
					}
				)

			} else {
				return;
			}
		});
	}

	comparePwdEachOther(newPwd, cfmPwd) {
		if (newPwd === cfmPwd) {
			return true;
		} else {
			return false;
		}
	}

	resetPwdInit() {
		this.info.new_password = null;
		this.info.confirm_password = null;
	}



	/**
	   * profile 사진 변경
	   * @param fileInput image file
	   */
	fileChangeEvent(fileInput: any) {
		console.log('fileChangeEvent');
		if (fileInput.target.files && fileInput.target.files[0]) {
			if (fileInput.target.files[0].name.toLowerCase().endsWith('.jpg')
				|| fileInput.target.files[0].name.toLowerCase().endsWith('.png')) {
				// Image resize and update
				this.changeProfileImage(fileInput.target.files[0]);
			} else {
				this.dialogService.openDialogNegative('Profile photos are only available for PNG and JPG.');
				// alert('프로필 사진은 PNG와 JPG만 가능합니다.');
			}
		} else {
			this.dialogService.openDialogNegative('Can not bring up pictures.');
			// alert('사진을 불러올 수 없습니다.');
		}
	}
	changeProfileImage(imgFile) {
		console.log(imgFile);
		this.profileService.changeProfileImage(imgFile).subscribe(
			(data: any) => {
				console.log(data);
				this.dataService.updateUserProfile(data.user);
				// this.profileService.getUserProfile().subscribe(
				// 	(data: any) => {
				// 		console.log(data);
				// 		this.dataService.updateUserProfile(data.user);
				// 		//  console.log(this.userInfo);
				// 	},
				// 	(err: any) => {
				// 		console.log(err);
				// 	}
				// )
			}
		), (err: any) => {
			console.log(err);
		}
	}
}
