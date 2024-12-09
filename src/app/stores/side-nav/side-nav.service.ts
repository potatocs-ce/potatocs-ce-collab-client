import { DestroyRef, Injectable, inject, signal, effect } from "@angular/core";
import { BreakpointObserver, BreakpointState, Breakpoints } from "@angular/cdk/layout";
import { distinctUntilChanged, map, shareReplay, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
@Injectable({
	providedIn: "root",
})
export class SideNavService {
	isDesktop = signal<boolean>(false);
	isSideNavOpen = signal<boolean>(true);
	destroyRef = inject(DestroyRef);
	private API_URL = environment.apiUrl;
	constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {
		this.breakpointObserver
			.observe(
				[Breakpoints.Large, Breakpoints.XLarge] //  1280px 이상 1920px 미만, 1920px이상 1280이상이면 true
				// ['(min-width: 1441px)'] // 현재 1441px 보다 작으면 false가 나온다
			)
			.pipe(
				tap((state: BreakpointState) => console.log(state.matches)),
				map((state: BreakpointState) => {
					this.isSideNavOpen.update((prev) => state.matches);
					return this.isDesktop.update((prev) => state.matches);
				}),
				shareReplay(), // HTML template 내의 여러 isDesktop$ 호출에 대해 1회만 실행
				distinctUntilChanged(),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();

		effect(() => {
			console.log("데스크탑 모드 : ", this.isDesktop());
		});
		effect(() => {
			console.log("sidenav : ", this.isSideNavOpen());
		});
	}

	createSpace(spaceData) {
		return this.http.post(`${this.API_URL}/collab/create-space`, spaceData);
	}

	//2024-06-13 박재현
	// 이름이 왜 이런지는 모르겠지만 space 정보 가져옴
	// 2024-06-14 박재현
	//업데이트하는 API가 아니라 get해서 가져온 데이터를 signal에 업데이트함
	updateSideMenu() {
		return this.http.get(`${this.API_URL}/collab/update-side-menu`);
	}
}
