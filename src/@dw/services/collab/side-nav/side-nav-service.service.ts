import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

	sideNavFlag: boolean;

	private menuDataSubject$ = new BehaviorSubject({});
	menuData$ = this.menuDataSubject$.asObservable();

	constructor(
		private http: HttpClient
	) { }

	createFolder(nameData) {
		return this.http.post('/api/v1/collab/create-folder', {folder_name: nameData})
	}

	deleteFolder(folderId){
		return this.http.delete('/api/v1/collab/deleteFolder', {params: folderId})
	}

	updateFolder(){
		return this.http.get('/api/v1/collab/update-folder');
	}

	createSpace(spaceData) {
		return this.http.post('/api/v1/collab/create-space', spaceData)
	}

	updateSideMenu() {
		return this.http.get('/api/v1/collab/update-side-menu');
	}
	updateSpacePlace(data) {
		return this.http.put('/api/v1/collab/update-space-place', data);
	}

	updateMenuData(menuData: any) {
		this.menuDataSubject$.next(menuData);
	}

	setTrueForSideNavFlag() {
		this.sideNavFlag = true;
	}

	setFalseForSideNavFlag() {
		this.sideNavFlag = false;
	}
}






