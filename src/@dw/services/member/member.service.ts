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



}
