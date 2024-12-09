import { Injectable, signal } from "@angular/core";
import {
	NavigationCreateSpace,
	NavigationDropdown,
	NavigationItem,
	NavigationLink,
	NavigationSubheading,
} from "../../interfaces/navigation-item.interface";
import { sidenavRouteInfo } from "../../config/sidenav-route-info";

@Injectable({
	providedIn: "root",
})
export class NavigationService {
	navItems: NavigationItem[] = sidenavRouteInfo;
	// selectedDropDownItem = signal<NavigationDropdown>({} as NavigationDropdown);
	selectedDropDownItem = signal<NavigationDropdown | null>(null);

	//드롭다운 아이템(현재 열려있는 아이템을 저장할 변수)
	openItems = signal<NavigationDropdown | null>(null);

	constructor() {}

	// updateNavItems(companyId: string) {
	// 	const newNavItems = structuredClone(sidenavRouteInfo);
	// 	// sideNav의 route에 company_id 추가
	// 	for (let item of newNavItems as any) {
	// 		item.children = item.children.map((element: any) => {
	// 			element.route = `company/${companyId}` + element.route;
	// 			return element;
	// 		});
	// 	}
	// 	// signal update
	// 	this.navItems.set(newNavItems);
	// }

	triggerOpenChange(item: NavigationDropdown) {
		this.selectedDropDownItem.set(item);
	}

	/**
	 * 현재 Menu가 Link에 해당하는지 check
	 * @param item Navigation Item
	 */
	isLink(item: NavigationItem): item is NavigationLink {
		return item.type === "link";
	}

	/**
	 * 현재 menu가 dropdown menu인지 check
	 * @param item Navigation Item
	 */
	isDropdown(item: NavigationItem): item is NavigationDropdown {
		return item.type === "dropdown";
	}

	/**
	 * 현재 menu가 Subheading인지 check
	 * @param item Navigation Item
	 */
	isSubheading(item: NavigationItem): item is NavigationSubheading {
		return item.type === "subheading";
	}

	/**
	 * 현재 menu가 Subheading인지 check
	 * @param item Navigation Item
	 */
	isCreateSpace(item: NavigationItem): item is NavigationCreateSpace {
		return item.type === "click";
	}
}
