import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EmployeeRegisterStorageService {

	private empRegReq$: BehaviorSubject<any>;
	regReq$: Observable<any>;

	constructor( 
		
	) {
		this.empRegReq$ = new BehaviorSubject([]);
		this.regReq$ = this.empRegReq$.asObservable();
	}

	updateRegReq(RegReqData: any) {
		this.empRegReq$.next(RegReqData);
	}

}