import { CommonService } from './../../services/common/common.service';
import { ProfilesService } from './../../services/profiles/profiles.service';
import { AuthService } from './../../services/auth/auth.service';
import {
  Component,
  Signal,
  inject,
  effect,
  ViewChild,
  ElementRef,
  DestroyRef,
  WritableSignal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from '../../stores/dialog/dialog.service';
import { ManagersService } from '../../services/managers/managers.service';
import { CompaniesService } from '../../services/companies/companies.service';
import { SideNavService } from '../../stores/side-nav/side-nav.service';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../materials/materials.module';
import { Observable } from 'rxjs';
import { ConnectCompanyDialogComponent } from '../../components/dialogs/connect-company-dialog/connect-company-dialog.component';
import moment from 'moment';
import { ConnectManagerDialogComponentComponent } from '../../components/dialogs/connect-manager-dialog-component/connect-manager-dialog-component.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dialog = inject(MatDialog);
  router = inject(Router);
  dialogsService = inject(DialogService);
  managersService = inject(ManagersService);
  companiesService = inject(CompaniesService);
  sideNavService = inject(SideNavService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  userInfo: Signal<any> = this.authService.userInfo;
  isDesktop: Signal<boolean> = this.sideNavService.isDesktop;

  @ViewChild('dash') dashElement!: ElementRef<HTMLDivElement>;
  @ViewChild('leaveBalance') leaveBalanceElement!: ElementRef<HTMLDivElement>;

  resizeObservable$!: Observable<Event>;

  manager: any;
  leaveInfo: any; // 휴가정보
  isRollover: any; // 휴가이월 정책
  minDate: any; // 휴가 이월
  maxDate: any; // 휴가 이월
  company: any; // 회사정책 정보
  currentDate: Date = new Date();

  commonService = inject(CommonService);
  profilesService = inject(ProfilesService);
  userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
  userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo;
  userManagerInfo: WritableSignal<any> = this.profilesService.userManagerInfo;

  tenure_today: string = '';
  constructor() {
    effect(() => {
      if (this.userProfileInfo()) {
        this.calculateTenure(this.userProfileInfo());
      }
    });
  }

  calculateTenure(data: any) {
    const date = new Date();

    const start = this.commonService.dateFormatting(data.emp_start_date);
    const end = this.commonService.dateFormatting(data.emp_end_date);

    const startDate = moment(start, 'YYYY-MM-DD');
    const endDate = moment(end, 'YYYY-MM-DD');
    const today = moment(this.commonService.dateFormatting(date), 'YYYY-MM-DD');
    this.tenure_today = this.yearMonth(startDate, today);
  }
  yearMonth(start: any, end: any) {
    var monthDiffToday = end.diff(start, 'months');
    if (isNaN(monthDiffToday)) {
      return '-';
    }
    var tmp = monthDiffToday;
    monthDiffToday = tmp % 12;
    var yearDiffToday = (tmp - monthDiffToday) / 12;

    return yearDiffToday + ' Years ' + monthDiffToday + ' Months';
  }

  deleteCompany(companyId: any) {
    this.dialogsService
      .openDialogConfirm('Do you want to delete the company?')
      .subscribe((result: any) => {
        if (result) {
          this.companiesService.deleteCompanyRequest(companyId).subscribe({
            next: (res: any) => {
              this.userCompanyInfo.update(() => null);
              this.dialogsService.openDialogPositive(
                'Successfully, the process has done!'
              );
            },
            error: (err: any) => {
              console.log(err);
              this.dialogsService.openDialogNegative(err);
            },
          });
        }
      });
  }

  openDialogFindMyCompany() {
    const dialogRef = this.dialog.open(ConnectCompanyDialogComponent);
  }

  deleteManager(managerId: any) {
    this.dialogsService
      .openDialogConfirm('Do you want to delete the manager?')
      .subscribe((result) => {
        if (result) {
          this.profilesService.userManagerInfo.update(() => null);
          this.dialogsService.openDialogPositive(
            'Successfully, the process has done'
          );
        }
      });
  }

  openDialogFindMyManager() {
    if (
      this.userCompanyInfo()?.status == 'pending' ||
      this.userCompanyInfo() == null
    ) {
      this.dialogsService.openDialogNegative(
        'Please, register a company first.'
      );
      return 0;
    }
    const dialogRef = this.dialog.open(ConnectManagerDialogComponentComponent, {
      data: {
        company_id: this.userCompanyInfo()._id,
      },
    });
    return dialogRef.afterClosed();
  }
}
