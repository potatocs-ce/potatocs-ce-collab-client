import { Employee } from "./employee.interface";

export interface Notification {
  _id: string;
  title: string;
  category: string;
  writer: Employee;
  updator: Employee;
  createAt: Date;
  updateAt: Date;
  contents: string;
}

//댓글 및 피드백은 나중에 개발
export interface Comment {

}
