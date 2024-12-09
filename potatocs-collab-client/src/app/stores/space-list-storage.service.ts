import { Injectable, WritableSignal, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class SpaceListStorageService {
	space: WritableSignal<any | null> = signal<any | null>(null);
	constructor() {}
}
