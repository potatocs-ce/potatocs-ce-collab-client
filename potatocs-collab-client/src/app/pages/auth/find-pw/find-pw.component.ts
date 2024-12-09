import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-find-pw',
  standalone: true,
  imports: [MaterialsModule, CommonModule, RouterLink],
  templateUrl: './find-pw.component.html',
  styleUrl: './find-pw.component.scss',
})
export class FindPwComponent {
  form: FormGroup;
  isDisabled: boolean = false;
  isShowed: boolean = false;

  emailFormData: any = {
    email: '',
    eCode: '',
  };

  private router = inject(Router);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private dialogService = inject(DialogService);

  constructor() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      eCode: [''],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.form.controls;
  }

  ngOnDestroy(): void {}

  getEcode() {
    // console.log(this.emailFormData);
    this.authService.getEcode(this.emailFormData).subscribe({
      next: (data: any) => {
        if (data.message == 'created') {
          this.isDisabled = true;
          this.isShowed = true;
        }
      },
      error: (err: any) => {
        console.log(err.error);
        this.errorAlert(err.error.message);
      },
    });
  }

  getTempPw() {
    this.authService.getTempPw(this.emailFormData).subscribe({
      next: (data: any) => {
        if (data.message == 'sentPw') {
          this.dialogService.openDialogPositive(
            'Your password has been reset successfully. Temporary password is sent to your email.'
          );
          this.router.navigate(['main']);
        }
      },
      error: (err: any) => {
        console.log(err.error);
        this.errorAlert(err.error.message);
      },
    });
  }

  errorAlert(err: any) {
    switch (err) {
      case 'not found':
        this.dialogService.openDialogNegative('Cannot find the email.');
        break;
      case 'not match':
        this.dialogService.openDialogNegative('Wrong verification code.');
        break;
      case 'pwd err':
        this.dialogService.openDialogNegative(
          'Cannot change your password. Try again.'
        );
        break;
    }
  }
}
