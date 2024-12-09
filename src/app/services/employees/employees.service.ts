import { Injectable, WritableSignal, inject, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { CommonService } from "../common/common.service";

@Injectable({
	providedIn: "root",
})
export class EmployeesService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	commonService = inject(CommonService);

	pendingList: WritableSignal<any[]> = signal([]);
	constructor() {}

	getPending() {
		return this.http
			.get(this.baseUrl + "/leave/pending-list")
			.pipe(tap((res: any) => this.pendingList.set(res.pendingList)));
	}

	acceptRequest(sendData: any) {
		return this.http.put(this.baseUrl + "/leave/accept-request", sendData);
	}

	cancelRequest(id: any) {
		return this.http.delete(this.baseUrl + "/leave/cancel-request/" + id);
	}

	// 매니저가 관리 중인 직원들 리스트
	getMyEmployeeList(active: string, direction: string, pageIndex: number, pageSize: number) {
		return this.http.get(this.baseUrl + "/employees", {
			params: { active, direction, pageIndex, pageSize },
		});
	}

	getEmployeeInfo(id: any) {
		return this.http.get(this.baseUrl + "/leave/employee-info/" + id);
	}

	putEmployeeInfo(sendData: any) {
		return this.http.put(this.baseUrl + "/leave/put-employee-info", sendData);
	}

	// 매니저가 관리중인 직원 휴가 리스트
	getMyEmployeesLeavesListSearch(data: any, active: string, direction: string, pageIndex: number, pageSize: number) {
		return this.http
			.get(this.baseUrl + "/leave/myEmployee-leaveList-search", {
				params: { ...data, active, direction, pageIndex, pageSize },
			})
			.pipe(
				tap((res: any) => {
					console.log(res);
					res.myEmployeeLeaveListSearch = res.myEmployeeLeaveListSearch?.map((item: any) => ({
						...item,
						// startDate: this.commonService.dateFormatting(item.leave_start_date, "timeZone"),
						// endDate: this.commonService.dateFormatting(item.leave_end_date, "timeZone"),
					}));
				})
			);
		// return this.http.get(this.baseUrl + '/leaves/myEmployee-leaveList-search', { params: data });
	}

	// admin 이 관리하는 manager의 employee 리스트 가져오기
	getMyManagerEmployeeList(managerID: any) {
		return this.http.get(this.baseUrl + "/leave/myManager-employee-list", {
			params: managerID,
		});
	}
}
