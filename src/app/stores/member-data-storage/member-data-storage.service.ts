import { Injectable, WritableSignal, effect, inject, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class MemberDataStorageService {
	member: WritableSignal<any | null> = signal<any | null>(null);

	constructor() {}
}
