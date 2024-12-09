import { NgModule } from "@angular/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatTreeModule } from "@angular/material/tree";
import { MatTabsModule } from "@angular/material/tabs";

import { MatStepperModule } from "@angular/material/stepper";
import { MatRadioModule } from "@angular/material/radio";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
	exports: [
		FlexLayoutModule,
		MatNativeDateModule,
		MatToolbarModule,
		MatTooltipModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatRippleModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatMenuModule,
		MatDatepickerModule,
		MatSelectModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatGridListModule,
		MatCheckboxModule,
		MatDividerModule,
		MatAutocompleteModule,
		MatChipsModule,
		MatBadgeModule,
		MatTreeModule,
		OverlayModule,
		PortalModule,
		ScrollingModule,
		MatOptionModule,
		MatTabsModule,
		MatStepperModule,
		MatRadioModule,
		MatProgressBarModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatSnackBarModule,
		DragDropModule,
		MatChipsModule,
	],
})
export class MaterialsModule {}
