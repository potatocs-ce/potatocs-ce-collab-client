import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { shareReplay, tap } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class CompaniesService {
	private baseUrl = environment.apiUrl;

	private http = inject(HttpClient);
	constructor() {}

	requestCompanyConnection(company_code: any) {
		return this.http.post(this.baseUrl + "/user/company-connections", company_code);
	}

	getRequestCompanyConnectionStatus() {
		return this.http.get(this.baseUrl + "/user/company-connections").pipe(
			shareReplay(1),
			tap((res: any) => {
				return res.message;
			})
		);
	}

	deleteCompanyRequest(id: any) {
		return this.http.delete(this.baseUrl + "/leave/deleteCompanyRequest/" + id);
	}
}
