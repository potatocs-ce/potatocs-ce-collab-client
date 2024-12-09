import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogCreateSpaceComponent } from "./dialog-create-space.component";

describe("CollabSidebarComponent", () => {
	let component: DialogCreateSpaceComponent;
	let fixture: ComponentFixture<DialogCreateSpaceComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogCreateSpaceComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogCreateSpaceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
