import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class EmployeeMngmtService {
	constructor(
		private http: HttpClient,
	) { }

	getPending() {
		return this.http.get('/api/v1/leave/pending-list');
	}

	acceptRequest(sendData) {
		return this.http.put('/api/v1/leave/accept-request', sendData);
	}

	cancelRequest(id) {
		return this.http.delete('/api/v1/leave/cancel-request/' + id);
	}

	// 매니저가 관리 중인 직원들 리스트
	getMyEmployeeList() {
		return this.http.get('/api/v1/leave/myEmployee-list');
	}

	getEmployeeInfo(id) {
		return this.http.get('/api/v1/leave/employee-info/' + id);
	}

	putEmployeeInfo(sendData) {
		return this.http.put('/api/v1/leave/put-employee-info', sendData);
	}

	// 매니저가 관리중인 직원 휴가 리스트
	getMyEmployeeLeaveListSearch(data){
		return this.http.get('/api/v1/leave/myEmployee-leaveList-search',{ params: data });
	}

	// admin 이 관리하는 manager의 employee 리스트 가져오기
	getMyManagerEmployeeList(managerID){
		return this.http.get('/api/v1/leave/myManager-employee-list',{ params: managerID });
	}
}