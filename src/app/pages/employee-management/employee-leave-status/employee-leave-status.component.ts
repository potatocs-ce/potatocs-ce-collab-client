import { Component, OnInit, ViewChild } from '@angular/core';


//table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//auto complete
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { EmployeeMngmtService } from 'src/@dw/services/leave/employee-mngmt/employee-mngmt.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

// Interface
import { ViewType } from 'src/@dw/interfaces/viewType.interface';

// view table
export interface PeriodicElement {
  startDate: Date;
  endDate: Date;
  name: string;
  leaveType: string;
  duration: number;
  email: string;
}

export interface Employees {
  _id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-employee-leave-status',
  templateUrl: './employee-leave-status.component.html',
  styleUrls: ['./employee-leave-status.component.scss']
})



export class EmployeeLeaveStatusComponent implements OnInit {

  // auto complete
  myControl = new FormControl();
  options: Employees[];
  filteredOptions: Observable<Employees[]>;

  // view table
  displayedColumns: string[] = ['startDate', 'endDate', 'name', 'emailFind','leaveType', 'duration','status',];
  dataSource

  employeeForm: FormGroup
  

  searchStr = '';

  // 이번 달 1일, 말일 만드는 변수
  // date = new Date();
  // monthFirst = new Date(this.date.setDate(1));
  // tmp = new Date(this.date.setMonth(this.date.getMonth() + 4));
  // monthLast = new Date(this.tmp.setDate(0));

  viewType:ViewType = {
		'annual_leave': 'Annual Leave',
    'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacement_leave': 'Replacement Day'
	}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private employeeMngmtService: EmployeeMngmtService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    const startOfMonth = moment().startOf('month').format();
    const endOfMonth   = moment().endOf('month').format();


    this.employeeForm = this.fb.group({
      type: ['all', [
        Validators.required,
      ]],
      leave_start_date: [startOfMonth, [
        Validators.required,
      ]],
      leave_end_date: [endOfMonth, [
        Validators.required,
      ]],
      emailFind: ['', [
        Validators.required,
      ]]
    });
    this.myEmployeeLeaveListSearch();

  }

  setAutoComplete() {
    // auto complete
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.email),
      map((email:any) => email ? this._filter(email) : this.options.slice())
    );

    console.log(this.filteredOptions);
  }

  //auto
  // displayFn(employee: Employees): string {
  //   return employee && employee.email ? employee.email : '';
  // }
  // getOptionText(employee: Employees) {
  //   return employee.email ? employee.email : '';
  // }
  private _filter(email: string): Employees[] {
    const filterValue = email.toLowerCase();
    return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
  }

  myEmployeeLeaveListSearch() {
    let myEmployeeInfo;
    const formValue = this.employeeForm.value;

    console.log(this.myControl.value);

    myEmployeeInfo = {
      type: formValue.type,
      leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
			leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),

      // leave_start_date: formValue.leave_start_date,
      // leave_end_date: formValue.leave_end_date,
      emailFind: this.myControl.value,
    }

    console.log(myEmployeeInfo);

    // 조건에 따른 사원들 휴가 가져오기
    this.employeeMngmtService.getMyEmployeeLeaveListSearch(myEmployeeInfo).subscribe(
      (data: any) => {
          
        data.myEmployeeLeaveListSearch = data.myEmployeeLeaveListSearch.map ((item)=> {
					item.startDate = this.commonService.dateFormatting(item.startDate, 'timeZone');
					item.endDate = this.commonService.dateFormatting(item.endDate, 'timeZone');
					return item;
				});

        this.dataSource = new MatTableDataSource<PeriodicElement>(data.myEmployeeLeaveListSearch);
        this.dataSource.paginator = this.paginator;

        this.options = data.myEmployeeList;
        this.setAutoComplete();
        console.log(this.options);
      }
    )
    return true;
  }

  searchBtn(){
		const flag = this.myEmployeeLeaveListSearch();
		if(flag){
			this.snackbar.open('Successfully get leave search data','Close' ,{
				duration: 3000,
				horizontalPosition: "center"
			});
		}
	}

  openDialogPendingLeaveDetail(data) {
      console.log(data)

		const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
			// width: '600px',
			// height: '614px',

			data: {
                _id: data.requestId,
				requestor: data._id,
				requestorName: data.name,
				leaveType: data.leaveType,
				leaveDuration: data.duration,
				leave_end_date: data.endDate,
				leave_start_date: data.startDate,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				approver: data.approver,
                rejectReason: data.rejectReason,
                isManager: true,
			}

		});

		dialogRef.afterClosed().subscribe(result => {
            this.myEmployeeLeaveListSearch();
			console.log('dialog close');
		})
	}
}
