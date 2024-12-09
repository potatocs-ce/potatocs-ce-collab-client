import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  commonService = inject(CommonService);

  constructor() {}
  // getMyLeaveList() {
  //   return this.http.get(this.baseUrl + '/leaves/my-request');
  // }
  getMyLeavesStatus() {
    return this.http.get(this.baseUrl + '/leave/my-status');
  }

  // dashboard 에서 매니저 지울때 pending 중인 leave 있는지 체크
  checkPendingLeave() {
    return this.http.get(this.baseUrl + '/leave/checkPendingLeave');
  }

  getMyLeavesSearch(
    data: any,
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http
      .get(this.baseUrl + '/leave/my-request-search', {
        params: { ...data, active, direction, pageIndex, pageSize },
      })
      .pipe(
        tap((res: any) => {
          console.log(res);

          res.myEmployeeList = res.myEmployeeList?.map((item: any) => ({
            ...item,
            leave_start_date: this.commonService.dateFormatting(
              item.leave_start_date,
              'timeZone'
            ),
            leave_end_date: this.commonService.dateFormatting(
              item.leave_end_date,
              'timeZone'
            ),
          }));
        }),
        catchError((error) => {
          console.error('Error fetching data:', error);
          return of({ total_count: 0, myEmployeeList: [] });
        })
      );
  }

  getMyLeaveList(
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/leave/my-request', {
      params: { active, direction, pageIndex, pageSize },
    });
  }

  getNationHolidays(nationId: any) {
    return this.http.get(this.baseUrl + '/leave/getNationList', {
      params: { id: nationId },
    });
  }

  requestLeave(leaveData: any) {
    return this.http.post(this.baseUrl + '/leave/request-leave', leaveData);
  }

  cancelMyRequestLeave(data: any) {
    return this.http.put(this.baseUrl + '/leave/cancel-my-request-leave', data);
  }

  /* -----------------------------------------------
    rd-request-list Component
  ----------------------------------------------- */
  getRdList(
    active: string,
    direction: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http.get(this.baseUrl + '/leave/getRdList', {
      params: { active, direction, pageIndex, pageSize },
    });
  }

  requestRdLeave(data: any) {
    return this.http.post(this.baseUrl + '/leave/requestRdLeave', data);
  }

  /* -----------------------------------------------
  replacement-day-request Component
----------------------------------------------- */
  requestConfirmRd(requestConfirmRdData: any) {
    return this.http.post(
      this.baseUrl + '/leave/requestConfirmRd',
      requestConfirmRdData
    );
  }

  requestCancelRd(rdObjId: any) {
    return this.http.delete(this.baseUrl + '/leave/requestCancelRd', {
      params: rdObjId,
    });
  }

  cancelEmployeeApproveLeave(leaveData) {
    return this.http.put(
      this.baseUrl + '/leave/cancel-Employee-Approve-Leave',
      leaveData
    );
  }
}
