import { Employee } from "./employee.interface";
import { Manager } from "./manager.interface";

export interface LeaveRequest {
  _id: string,
  requestor: Employee, // employeeId
  leaveType: string, // Annual_leave, Sick_leave
  leaveDay: string, // 반차인지 연차인지 구분
  leaveStartDate: Date | string, // 계약 시작일
  leaveEndDate: Date | string, // 계약 끝나는 날
  leaveDuration: number, // 기간
  leaveReason: string, // 연차사유
  status: string, // rejected, cancel, approve
  rejectedReason: string,
  rejector: Manager,// 매니저 거절
}