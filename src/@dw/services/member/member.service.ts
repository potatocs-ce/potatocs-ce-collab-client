import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from 'src/@dw/config/config';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

interface Token {
  token: String
}

@Injectable({
  providedIn: 'root'
})
export class memberService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,

  ) { }

  getMembers() {
    return this.http.get('/api/v1/members')
  }

  getMember(id: any) {
    return this.http.get('/api/v1/members/', id)
  }

  addMember({ name: string, age: string, todos: any }: Member) {
    return this.http.post('/api/v1/members/')
  }

  updateMember({ name: string, age: string, todos: any }: Member) {
    return this.http.patch('/api/v1/members/')
  }

  deleteMember(id) {
    return this.http.delete('/api/v1/members/', id)

  }

}
