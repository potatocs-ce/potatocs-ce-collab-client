import { ProfilesService } from './../../../../services/profiles/profiles.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MaterialsModule } from '../../../../materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeavesService } from '../../../../services/leaves/leaves.service';
import { CommonService } from '../../../../services/common/common.service';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaves-requests-add',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leaves-requests-add.component.html',
  styleUrl: './leaves-requests-add.component.scss',
})
export class LeavesRequestsAddComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  profilesService = inject(ProfilesService);
  leavesService = inject(LeavesService);
  commonService = inject(CommonService);
  dialogsService = inject(DialogService);

  userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
  userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo;
  myLeaves: WritableSignal<any | null> = signal(null);

  employeeLeaveForm: FormGroup = this.fb.group({
    leaveType1: ['', [Validators.required]],
    leaveType2: ['', [Validators.required]],
    leave_start_date: ['', [Validators.required]],
    leave_end_date: ['', [Validators.required]],
    leave_reason: ['', [Validators.required]],
  });

  holidayList: string[] = [];
  rolloverMinDate: any;
  rolloverMaxDate: any;
  minDate: Date | null = null;
  maxDate: Date | null = null;
  isRollover = false;
  isHalf = false;
  leaveDuration: any;

  days: any;
  start_date_sec: any;
  end_date_sec: any;
  millisecondsPerDay: any;
  diff: any;
  weeks: any;
  leaveDays: any;

  myInfo: any;
  // 원하는 총 휴가 기간

  leaveRequestData: any;
  leaveInfo: any;
  company: any;
  user: any;

  holidayDateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const day = d.getDay();
    const formattedDate = moment(d);
    const isHoliday = this.holidayList.some((holiday) =>
      moment(holiday).isSame(formattedDate, 'day')
    );
    return day !== 0 && day !== 6 && !isHoliday;
  };

  constructor() {
    effect(() => {
      const profileInfo = this.userProfileInfo();
      const companyInfo = this.userCompanyInfo();

      if (profileInfo?.location) {
        this.leavesService.getNationHolidays(profileInfo.location).subscribe({
          next: (res: any) => {
            this.holidayList = [
              ...this.holidayList,
              ...res.nation[0]?.countryHoliday.map((h: any) =>
                moment.utc(h.holidayDate).local().format('YYYY-MM-DD')
              ),
            ];
          },
          error: () => {},
        });
      }

      if (companyInfo) {
        this.holidayList = [
          ...this.holidayList,
          ...companyInfo.company_holiday.map((h: any) =>
            moment.utc(h.ch_date).local().format('YYYY-MM-DD')
          ),
        ];

        this.leavesService.getMyLeavesStatus().subscribe({
          next: (res) => {
            this.myLeaves.set(res);
          },
          error: () => {},
        });
      }
    });
  }

  ngAfterViewInit() {}

  // 휴가 분류 변경 시 호출되는 함수
  classificationChange(value: any) {
    if (value === 'rollover') {
      this.minDate = this.rolloverMinDate; // 롤오버 최소 날짜 설정
      this.maxDate = this.rolloverMaxDate; // 롤오버 최대 날짜 설정
    }
    this.datePickDisabled(); // 날짜 선택 비활성화
    this.datePickReset(); // 날짜 선택 초기화
  }

  // 휴가 단위 변경 시 호출되는 함수 (연차, 반차)
  typeSecondChange(value: any) {
    if (value === 'half') {
      // 반차인 경우
      this.employeeLeaveForm.controls['leave_start_date'].enable(); // 시작 날짜 활성화
      this.employeeLeaveForm.controls['leave_end_date'].disable(); // 종료 날짜 비활성화
      this.isHalf = true; // 반차 설정
    } else {
      // 하루인 경우
      this.employeeLeaveForm.controls['leave_start_date'].enable(); // 시작 날짜 활성화
      this.employeeLeaveForm.controls['leave_end_date'].enable(); // 종료 날짜 활성화
      this.isHalf = false; // 하루 설정
    }
    this.datePickReset(); // 날짜 선택 초기화
  }

  // 날짜 변경 시 호출되는 함수
  checkDateChange(value: any) {
    const formValue = this.employeeLeaveForm.value;
    const start_date = formValue.leave_start_date;
    const end_date = formValue.leave_end_date;
    const currentClassification = formValue.leaveType1;
    const matchedLeaveDay = this.availableLeaveCount(currentClassification);

    if (this.checkEmpYear(start_date, end_date)) {
      // 근속 년수 체크
      if (this.isHalf) {
        // 반차인 경우
        this.leaveDuration = 0.5;
        if (!this.userCompanyInfo().isMinusAnnualLeave) {
          // 연차 감소 허용 여부
          if (this.leaveDuration > matchedLeaveDay || this.leaveDuration < 0) {
            this.dialogsService.openDialogNegative('Wrong period, Try again.');
            this.allReset();
            return;
          }
        }
      } else {
        // 하루인 경우
        this.leaveDuration = this.calculateDiff(start_date, end_date);
        if (!this.userCompanyInfo().isMinusAnnualLeave) {
          if (this.leaveDuration > matchedLeaveDay || this.leaveDuration < 0) {
            this.dialogsService.openDialogNegative('Wrong period, Try again.');
            this.allReset();
            return;
          }
        }
      }
    }
  }

  datePickChange(dateValue: any) {
    // this.checkEmpYear(dateValue);
    // this.employeeLeaveForm.get('leave_end_date')?.setValue('');
  }

  // 시작 날짜와 종료 날짜의 차이를 계산하는 함수
  calculateDiff(start_date: any, end_date: any) {
    const holidayCount = this.holidayList.filter((x: any) => {
      return new Date(x) <= end_date && new Date(x) >= start_date;
    }).length; // 공휴일 수 계산

    const millisecondsPerDay = 86400 * 1000; // 하루를 밀리초로 변환
    const start_date_sec = start_date.setHours(0, 0, 0, 1); // 시작 날짜를 자정 직후로 설정
    const end_date_sec = end_date.setHours(23, 59, 59, 999); // 종료 날짜를 자정 직전으로 설정
    const diff = end_date_sec - start_date_sec; // 두 날짜 간의 밀리초 차이 계산
    let days = Math.ceil(diff / millisecondsPerDay); // 일수로 변환

    if (start_date_sec >= end_date_sec) {
      // 시작 날짜가 종료 날짜보다 뒤인 경우
      this.dialogsService.openDialogNegative('Wrong period, Try again.');
      this.datePickReset();
      return 0;
    }

    const weeks = Math.floor(days / 7);
    days -= weeks * 2; // 주말을 제외한 일수 계산

    const startDay = start_date.getDay();
    const endDay = end_date.getDay();

    if (startDay - endDay > 1) days -= 2; // 주말 처리
    if (startDay === 0 && endDay !== 6) days -= 1; // 시작일이 일요일인 경우
    if (endDay === 6 && startDay !== 0) days -= 1; // 종료일이 토요일인 경우

    return days - holidayCount; // 최종 일수에서 공휴일 제외
  }

  // 사용 가능한 휴가 일수를 반환하는 함수
  availableLeaveCount(type: string) {
    const leaves = this.myLeaves();
    switch (type) {
      case 'annual_leave':
        return leaves.annual_leave - leaves.used_annual_leave; // 연차 휴가 일수
      case 'rollover':
        return leaves.rollover - leaves.used_rollover; // 롤오버 휴가 일수
      case 'sick_leave':
        return leaves.sick_leave - leaves.used_sick_leave; // 병가 일수
      default:
        return leaves.replacement_leave - leaves.used_replacement_leave; // 대체 휴가 일수
    }
  }
  // 날짜 선택 초기화
  datePickReset() {
    this.employeeLeaveForm.get('leave_start_date')?.reset();
    this.employeeLeaveForm.get('leave_end_date')?.reset();
  }

  // 날짜 선택 비활성화
  datePickDisabled() {
    this.employeeLeaveForm.controls['leave_start_date'].disable();
    this.employeeLeaveForm.controls['leave_end_date'].disable();
  }

  // 모든 필드 초기화 및 비활성화
  allReset() {
    this.employeeLeaveForm.reset();
    this.datePickDisabled();
  }

  // 휴가 쓰는 기간이 N년차 범위에 속하는지, 안속하면 안돼
  checkEmpYear(start_date: any, end_date: any) {
    const cal_start_date = this.commonService.dateFormatting(
      start_date,
      'timeZone'
    );
    const cal_end_date = this.commonService.dateFormatting(
      end_date,
      'timeZone'
    );
    const startYear = this.commonService.dateFormatting(
      this.myLeaves().startYear,
      'timeZone'
    );
    const endYear = this.commonService.dateFormatting(
      this.myLeaves().endYear,
      'timeZone'
    );

    if (this.isHalf) return true; // 반차인 경우 바로 반환

    if (
      cal_start_date >= startYear &&
      cal_start_date <= endYear &&
      cal_end_date >= startYear &&
      cal_end_date <= endYear
    ) {
      return true; // 휴가가 같은 근무 연한 내에 있는 경우
    } else if (cal_start_date > endYear && cal_end_date > endYear) {
      this.dialogsService
        .openDialogConfirm(
          `Your current contract period: ${startYear} ~ ${endYear}.\nThis annual leave request will be counted on next year's annual leave. Do you want to proceed?`
        )
        .subscribe((result) => {
          if (result) return true;
          else {
            this.datePickReset();
            return false;
          }
        });
      return true; // 휴가가 다음 근무 연한 내에 있는 경우
    } else {
      this.dialogsService.openDialogNegative(
        `Your current contract period: ${startYear} ~ ${endYear}.\nPlease, choose leave dates within the current contract period or after the end of your current period to use next year's annual leave.`
      );
      this.datePickReset();
      return false; // 휴가가 유효하지 않은 경우
    }
  }
  requestLeave() {
    // '휴가 요청을 제출하시겠습니까?' 확인 대화상자를 열고 사용자의 응답을 구독
    this.dialogsService
      .openDialogConfirm('Would you like to submit the leave request?')
      .subscribe({
        next: (res) => {
          // 사용자가 '확인'을 클릭한 경우
          if (res) {
            // 휴가 요청 데이터를 준비하는 메서드 호출
            this.prepareLeaveRequestData();
            // 휴가 요청을 제출하는 메서드 호출
            this.submitLeaveRequest();
          }
        },
        error: (err: any) => {
          this.dialogsService.openDialogNegative(err.error.message);
        },
      });
  }

  prepareLeaveRequestData() {
    const formValue = this.employeeLeaveForm.value;
    // 시작 날짜를 공통 서비스의 날짜 포맷팅 메서드를 사용하여 포맷팅
    const leaveStartDate = this.commonService.dateFormatting(
      formValue.leave_start_date
    );
    // 반차인 경우 시작 날짜와 동일하게 설정하고, 그렇지 않은 경우 종료 날짜를 포맷팅
    const leaveEndDate =
      this.leaveDuration == 0.5
        ? leaveStartDate
        : this.commonService.dateFormatting(formValue.leave_end_date);

    this.leaveRequestData = {
      leaveType: formValue.leaveType1, // 휴가 타입
      leaveDay: formValue.leaveType2, // 휴가 단위 (하루 또는 반차)
      leaveDuration: this.leaveDuration, // 휴가 기간
      leave_start_date: leaveStartDate, // 시작 날짜
      leave_end_date: leaveEndDate, // 종료 날짜
      leave_reason: formValue.leave_reason, // 휴가 사유
      status: 'pending', // 요청 상태를 '대기 중'으로 설정
    };
  }

  submitLeaveRequest() {
    this.leavesService.requestLeave(this.leaveRequestData).subscribe({
      next: (data: any) => {
        if (data.message === 'requested') {
          this.router.navigate(['leaves/requests']);
          this.dialogsService.openDialogPositive(
            'Successfully, the request has been submitted.'
          );
        }
      },
      error: (err: any) => {
        this.dialogsService.openDialogNegative(err.error.message);
      },
    });
  }

  toBack() {
    this.router.navigate(['/leaves/requests']);
  }
}
