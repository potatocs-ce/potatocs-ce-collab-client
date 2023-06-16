import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/@dw/services/auth/auth.service';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { OnDestroy } from '@angular/core';

interface EmailFormData {
	email: string;
	eCode: String;
}

@Component({
    selector: 'app-find-pw',
    templateUrl: './find-pw.component.html',
    styleUrls: ['./find-pw.component.scss'],
})
export class FindPwComponent implements OnInit, OnDestroy {
    form: FormGroup;
	isDisabled: boolean;
	isShowed: boolean;

    emailFormData: EmailFormData = {
        email: '',
		eCode: ''
    };

    constructor(
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder,
        private dialogService: DialogService,
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
			eCode: ['']
        });
    }

    ngOnInit(): void {
    }

    get f() {
        return this.form.controls;
    }

	ngOnDestroy(): void {

	}

    getEcode() {
        // console.log(this.emailFormData);
        this.authService.getEcode(this.emailFormData).subscribe(
            (data: any) => {
                if (data.message == 'created') {

                    this.isDisabled = true;
					this.isShowed = true;
                }
                
            },
            err => {
                console.log(err.error);
				this.errorAlert(err.error.message);
            },
        );
    }

	getTempPw() {
		this.authService.getTempPw(this.emailFormData).subscribe(
			(data: any) => {
				// console.log(data);
				if(data.message == 'sentPw') {
					this.dialogService.openDialogPositive('Your password has been reset successfully. Temporary password is sent to your email.');

					this.router.navigate(['main']);
				}
			},
			err => {
                console.log(err.error);
				this.errorAlert(err.error.message);
            },
		);
	}

	errorAlert(err) {
		switch(err) {
			case 'not found':
				this.dialogService.openDialogNegative('Cannot find the email.');
				break;
			case 'not match':
				this.dialogService.openDialogNegative('Wrong verification code.');
				break;
			case 'pwd err':
				this.dialogService.openDialogNegative('Cannot change your password. Try again.');
				break;
		}

	};
}
