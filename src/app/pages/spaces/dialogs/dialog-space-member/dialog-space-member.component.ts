import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SpacesService } from "../../../../services/spaces/spaces.service";
import { DialogService } from "../../../../stores/dialog/dialog.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MaterialsModule } from "../../../../materials/materials.module";
import { CdkTableModule } from "@angular/cdk/table";
@Component({
	selector: "app-dialog-space-member",
	standalone: true,
	imports: [MatFormFieldModule, FormsModule, MaterialsModule, CdkTableModule],
	templateUrl: "./dialog-space-member.component.html",
	styleUrl: "./dialog-space-member.component.scss",
})
export class DialogSpaceMemberComponent implements OnInit {
	// myControl = new FormControl();
	// options: members[];
	// filteredOptions: Observable<members[]>;
	searchEmail;
	displaymemberInfo;
	memberInfo: any;
	spaceTime;
	displayedColumns: string[] = ["name", "email", "invite"];
	constructor(
		private spacesService: SpacesService,
		private route: ActivatedRoute,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogService: DialogService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit() {
		this.spaceTime = this.data.spaceTime;
		console.log(this.spaceTime);
		// this.getAllMemeber();
		// console.log(this.myControl);
		// console.log(this.options);
	}

	searchSpaceMember() {
		const email = this.searchEmail;
		this.spacesService.searchSpaceMember({ email }).subscribe({
			next: (data: any) => {
				console.log(data);
				if (data.message == `retired spaceMember`) {
					this.dialogService.openDialogNegative(`An employee who's retired at the company.`);
					// alert(`It's a member that doesn't exist.\nPlease check email`);
				} else if (data.searchSpaceMember == null) {
					this.dialogService.openDialogNegative(`It's a member that doesn't exist.\nPlease check email`);
					// alert(`It's a member that doesn't exist.\nPlease check email`);
				} else {
					this.memberInfo = [data.searchSpaceMember];
					this.displaymemberInfo = this.memberInfo;
					console.log(this.memberInfo);
					console.log(this.displaymemberInfo);
				}
			},
			error: (err: any) => {
				console.log(err);
			},
		});
	}

	inviteSpaceMember(member) {
		// const result = confirm(`Do you want to invite?`);
		// if (result) {
		this.dialogService.openDialogConfirm(`Do you want to invite the member?`).subscribe((result) => {
			if (result) {
				// console.log(member._id);
				// console.log('inviteSpaceMember');
				const data = {
					member_id: member._id,
					spaceTime: this.spaceTime,
				};
				// console.log(data);
				this.spacesService.inviteSpaceMember(data).subscribe({
					next: (data: any) => {
						// console.log(data);
						// this.dialogService.openDialogPositive('Successfully, the member has invited.');
						this.snackbar.open("Successfully, the member has invited.", "Close", {
							duration: 3000,
							horizontalPosition: "center",
						});
						// alert('Successfully, invited.');
						this.displaymemberInfo = "";
						// this.searchEmail = '';
						this.reUpdateMembers();
					},
					error: (err: any) => {
						// console.log(err);
						this.displaymemberInfo = "";
						// this.searchEmail = '';
						this.dialogService.openDialogNegative(err.error.message);
					},
				});
			}
		});
	}

	reUpdateMembers() {
		console.log(this.spaceTime);
		this.spacesService.getSpaceMembers(this.spaceTime).subscribe({
			next: (data: any) => {
				console.log(data);
			},
			error: (err: any) => {
				console.log("spaceService error", err);
			},
		});
	}
}
