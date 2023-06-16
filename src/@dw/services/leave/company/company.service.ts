import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';

import { PendingCompanyRequestStorageService } from '../../../store/pending-company-request-storage.service';
import { DataService } from '../../../store/data.service';

@Injectable({
  	providedIn: 'root'
})
export class CompanyService {

	constructor(
		private http: HttpClient,
		private pendingCompReqStorageService: PendingCompanyRequestStorageService,
		private dataService: DataService
	) { }

	addingCompany(company_code) {
		return this.http.post('/api/v1/leave/addingCompany', company_code)
		.pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);
					this.dataService.updateUserCompanyProfile(res.pendingCompanyData);
					return res.message;
				}
			)
		);
	}

	getPendingCompanyRequest() {
		return this.http.get('/api/v1/leave/getPendingCompanyRequest')
		.pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);
					return res.message;
				}
			)
		);
	}

	deleteCompanyRequest(request_id) {
		console.log(request_id);
		return this.http.delete('/api/v1/leave/deleteCompanyRequest/' + request_id)
		.pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);
					return res.message;
				}
			)
		);
	}
}
