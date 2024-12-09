import { Employee } from "./employee.interface";

export interface Contract {
  _id: string;
  writer: Employee, // 작성자 (admin)
  employee: Employee, // 직원
  employeeSign: string, // 직원서명
  employeeHash: string, // 직원 privateKey + pdf hash 값 암호화
  employeeStatus: string, // pending | reviewed | rejected | signed
  manager: string, // 매니저 
  managerSign: string, // 매니저 서명
  managerHash: string, // 매니저 privateKey + pdf hash 값 암호화
  managerStatus: string, // pending | reviewed | rejected | signed
  key: string, // 원본 파일명
  location: string, // 저장위치
  originalname: string, // 파일명
  title: string, // 제목
  pdfHash: string, // pdf 해시값
  description: string, // 설명
  rejectReason: string, // 거절사유
}

export interface ContractForm {
  pdf: File,
  title: string,
  description: string,
  employee: string,
  writer: string,
  company: string,
  contractId?: string,

}