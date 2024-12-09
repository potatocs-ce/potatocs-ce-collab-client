import { Injectable, WritableSignal, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { shareReplay, tap } from "rxjs";
import { ProfilesService } from "../profiles/profiles.service";

@Injectable({
	providedIn: "root",
})
export class ManagersService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);
	profilesService = inject(ProfilesService);

	userManagerInfo: WritableSignal<any> = this.profilesService.userManagerInfo;

	constructor() {}
	findManager(sendData: any) {
		return this.http.get(this.baseUrl + "/leave/find-manager", { params: sendData });
	}

	addManager(_id: any) {
		console.log(_id);
		return this.http.post(this.baseUrl + "/leave/add-manager", { manager_id: _id }).pipe(
			tap((res: any) => {
				console.log(res);
				this.userManagerInfo.update(() => res.getManager);
				return res.message;
			})
		);
	}

	// getManagerInfo() {
	//   return this.http.get('/api/v1/leave/get-manager').pipe(
	//     shareReplay(1),
	//     tap(
	//       (res: any) => {
	//         this.pendingFindManagerStorageService.updatePendingRequest(res.getManager);
	//         return res.message;
	//       }
	//     )
	//   );
	// }

	// cancelPending(id) {
	//   return this.http.delete('/api/v1/leave/cancel-pending/' + id).pipe(
	//     shareReplay(1),
	//     tap(
	//       (res: any) => {
	//         this.pendingFindManagerStorageService.updatePendingRequest(res.pendingCompanyData);
	//         return res.message;
	//       }
	//     )
	//   );
	// }

	deletePending(id: any) {
		return this.http.delete(this.baseUrl + "/leave/delete-my-manager/" + id);
	}
}
