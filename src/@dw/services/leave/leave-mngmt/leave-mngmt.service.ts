import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { MyRequestLeaveStorageService } from 'src/@dw/store/my-request-leave-storage.service';
import { CommonService } from '../../common/common.service';

@Injectable({
	providedIn: 'root'
})
export class LeaveMngmtService {

	constructor(
		private http: HttpClient,
		private myRequestLeaveStorage: MyRequestLeaveStorageService,
		private commonService : CommonService
	) { }

	/* -----------------------------------------------
		Request Leave Component
	----------------------------------------------- */
	requestLeave(leaveData) {
		return this.http.post('/api/v1/leave/request-leave', leaveData)
	}

	/* -----------------------------------------------
		Leave Request Detail Component
	----------------------------------------------- */
	cancelMyRequestLeave(data){
		return this.http.put('/api/v1/leave/cancel-my-request-leave', data)
	}

	/* -----------------------------------------------
		Main Component
	----------------------------------------------- */
	getMyLeaveStatus() {
		return this.http.get('/api/v1/leave/my-status');
	}

	/* -----------------------------------------------
		Main Component
	----------------------------------------------- */
	getMyLeaveList() {
		return this.http.get('/api/v1/leave/my-request');
	}

	/* -----------------------------------------------
		Request Leave List Component
	----------------------------------------------- */
	getMyLeaveListSearch(data){
		return this.http.get('/api/v1/leave/my-request-search', { params: data }).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					// console.log(res);

					data = res.map((item)=> {
						item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
						item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
						return item;
					});
					this.myRequestLeaveStorage.updateMyRequestLeave(data);
					return res.message;
				}
			)
		);
	}

	/* -----------------------------------------------
		replacement-day-request Component
	----------------------------------------------- */
	requestConfirmRd(requestConfirmRdData) {
		return this.http.post('/api/v1/leave/requestConfirmRd', requestConfirmRdData);
	}

	requestCancelRd(rdObjId) {
		return this.http.delete('/api/v1/leave/requestCancelRd', {params: rdObjId})
	}

	/* -----------------------------------------------
		rd-request-list Component
	----------------------------------------------- */
	getRdList() {
		return this.http.get('/api/v1/leave/getRdList');
	}

	requestRdLeave(data) {
		return this.http.post('/api/v1/leave/requestRdLeave', data);
	}

	// 휴가 요청시 나라별 공휴일 가져오기 위한 것
	getNationList(nationId) {
		return this.http.get('/api/v1/leave/getNationLIst', {params : nationId})
	}

	// dashboard 에서 매니저 지울때 pending 중인 leave 있는지 체크
	checkPendingLeave(){
		return this.http.get('/api/v1/leave/checkPendingLeave');
	} 
}	