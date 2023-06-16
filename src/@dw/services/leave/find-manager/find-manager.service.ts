import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';

import { PendingFindManagerStorageService } from '../../../store/pending-find-manager-storage.service';
import { DataService } from '../../../store/data.service';
@Injectable({
	providedIn: 'root'
})
export class FindManagerService {

	constructor(
		private http: HttpClient,
		private pendingFindManagerStorageService: PendingFindManagerStorageService,
		private dataService: DataService
	) { }

	/**
	 * Find My Manager	 * 
	 * @param _id a manager's email id
	 */
	findManager(sendData) {
		return this.http.get('/api/v1/leave/find-manager', { params: sendData});
	}

	addManager(_id) {
		console.log(_id);
		return this.http.post('/api/v1/leave/add-manager', { manager_id: _id }).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingFindManagerStorageService.updatePendingRequest(res.getManager);
					this.dataService.updateUserManagerProfile(res.getManager);
					return res.message;
				}
			)
		);
	}

	getManagerInfo() {
		return this.http.get('/api/v1/leave/get-manager').pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.pendingFindManagerStorageService.updatePendingRequest(res.getManager);
					return res.message;
				}
			)
		);
	}

	cancelPending(id) {
		return this.http.delete('/api/v1/leave/cancel-pending/' + id).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.pendingFindManagerStorageService.updatePendingRequest(res.pendingCompanyData);
					return res.message;
				}
			)
		);
	}

	deletePending(id){
		return this.http.delete('/api/v1/leave/delete-my-manager/' + id).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.pendingFindManagerStorageService.updatePendingRequest(res.pendingData);
					return res.message;
				}
			)
		);
	}
}
