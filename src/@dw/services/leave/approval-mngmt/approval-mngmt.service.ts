import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApprovalMngmtService {

    constructor(
        private http: HttpClient
    ) { }

    getLeaveRequest() {
        return this.http.get('/api/v1/leave/pending-leave-request');
    }

    approvedLeaveRequest(data) {
        return this.http.put('/api/v1/leave/approve-leave-request', data)
    }

    deleteLeaveRequest(data) {
        return this.http.put('/api/v1/leave/delete-request', data)
    }


    /* -----------------------------------------------
        The manager cancels the employee's approved leave
    ----------------------------------------------- */
    cancelEmployeeApproveLeave(leaveData) {
        return this.http.put('/api/v1/leave/cancel-Employee-Approve-Leave', leaveData)
    }

    // Get a list of Members who has submitted a RD request to be confirmed.
    getConfirmRdRequest() {
        return this.http.get('/api/v1/leave/getConfirmRdRequest');
    }

    // RD 요청 거절
    rejectReplacementRequest(data) {
        return this.http.put('/api/v1/leave/rejectReplacementRequest', data)
    }

    // RD 요청 수락
    approveReplacementRequest(data) {
        return this.http.put('/api/v1/leave/approveReplacementRequest', data)
    }
}