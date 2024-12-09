import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.chatApiUrl;

  constructor(private http: HttpClient) { }

  // 문서 등록
  addDocs(company: string, files: File[]) {
    let formdata: FormData = new FormData();
    console.log(company, files)
    for (let file of files) {

      formdata.append('files', file, file.name);
    }
    console.log(formdata)
    formdata!.append('company', company);

    return this.http.post(this.baseUrl + `/chat/add`, formdata);
  }


  // 질문
  ask(question: string, history: Array<string>, company: string) {
    return this.http.post(this.baseUrl + `/chat`, { question, history, company });
  }

  // 리스트 불러오기
  getList(company: string, user: string) {
    return this.http.get(this.baseUrl + '/chat/list', {
      params: {
        company, user
      }
    })
  }
  // 문서 불러오기
  getDoc(key: string) {
    return this.http.post(this.baseUrl + '/chat/doc', { key }, { responseType: 'blob', observe: 'response' })
  }


  deleteDoc(_id: string) {
    return this.http.delete(this.baseUrl + `/chat/delete/${_id}`)
  }
}
