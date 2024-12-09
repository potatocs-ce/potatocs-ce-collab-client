import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../common/common.service";
import { tap } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ApprovalService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	commonService = inject(CommonService);
	constructor() {}

	getLeaveRequest(active: string, direction: string, pageIndex: number, pageSize: number) {
		return this.http.get(this.baseUrl + "/leave/requests", {
			params: { active, direction, pageIndex, pageSize },
		});
	}

	approvedLeaveRequest(data: any) {
		return this.http.put(this.baseUrl + "/leave/approve-leave-request", data);
	}

	rejectLeaveRequest(data: any) {
		return this.http.put(this.baseUrl + "/leave/reject-leave-request", data);
	}

	/* -----------------------------------------------
  The manager cancels the employee's approved leave
----------------------------------------------- */
	cancelEmployeeApproveLeave(leaveData: any) {
		return this.http.put(this.baseUrl + "/leave/cancel-Employee-Approve-Leave", leaveData);
	}

	// Get a list of Members who has submitted a RD request to be confirmed.
	getConfirmRdRequest(active: string, direction: string, pageIndex: number, pageSize: number) {
		return this.http
			.get(this.baseUrl + "/leave/getConfirmRdRequest", { params: { active, direction, pageIndex, pageSize } })
			.pipe(
				tap((res: any) => {
					console.log(res);

					res.rdConfirmRequest = res.rdConfirmRequest?.map((item: any) => ({
						...item,
						leave_start_date: this.commonService.dateFormatting(item.leave_start_date, "timeZone"),
						leave_end_date: this.commonService.dateFormatting(item.leave_end_date, "timeZone"),
					}));
				})
			);
	}

	// RD 요청 거절
	rejectReplacementRequest(data: any) {
		return this.http.put(this.baseUrl + "/leave/rejectReplacementRequest", data);
	}

	// RD 요청 수락
	approveReplacementRequest(data: any) {
		return this.http.put(this.baseUrl + "/leave/approveReplacementRequest", data);
	}
}
