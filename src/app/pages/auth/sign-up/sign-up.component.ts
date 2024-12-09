import { DialogService } from './../../../stores/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  // 의존성 주입
  fb = inject(FormBuilder)
  authService = inject(AuthService)
  dialogService = inject(DialogService)
  router = inject(Router);

  signUpForm: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
    confirmedPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
  }, { validators: passwordMatchValidator });

  constructor() { }

  signUp() {
    console.log(this.signUpForm.value)
    this.authService.signUp(this.signUpForm.value).subscribe({
      next: (res: any) => {
        console.log(res)
        this.dialogService.openDialogPositive('Successfully signed up');
        this.router.navigate(['/sign-in']);
      },
      error: (error: any) => {
        console.log(error.message)
        this.dialogService.openDialogNegative(error.message);
      }
    })
  }



}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // control을 FormGroup으로 캐스팅합니다.
  const formGroup = control as FormGroup;
  const password = formGroup.get('password')?.value;
  const confirmedPassword = formGroup.get('confirmedPassword')?.value;

  // 비밀번호가 서로 일치하지 않으면 mismatch 오류를 반환합니다.
  return password && confirmedPassword && password === confirmedPassword ? null : { mismatch: true };
};