import { Injectable, WritableSignal, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class MeetingListStorageService {
	meeting: WritableSignal<any | null> = signal<any | null>(null);
	constructor() {}
}
