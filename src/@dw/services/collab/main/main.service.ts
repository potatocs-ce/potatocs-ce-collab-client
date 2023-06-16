import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient,
  ) { }


  getMainInfo(){
		// { params: data }
		return this.http.get('/api/v1/collab//main/getMainInfo');
	}

}
