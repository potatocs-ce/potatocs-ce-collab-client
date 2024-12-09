import { Employee } from "./employee.interface";

export interface PayStub {
  _id: string,
  employee: Employee, // 직원
  key: string, // 원본 파일명
  location: string, // 저장위치
  originalname: Date | string, // 파일명
  title: Date | string, // 제목
  updatedAt: number, // 업로드 시간
  writer: Employee, // 작성자
}