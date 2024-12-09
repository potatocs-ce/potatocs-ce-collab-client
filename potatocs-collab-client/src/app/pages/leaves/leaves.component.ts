import { CommonModule } from '@angular/common';
import { Component, ViewChild, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

// Interface

import { MaterialsModule } from '../../materials/materials.module';
import { ProfilesService } from '../../services/profiles/profiles.service';
import { LeavesService } from '../../services/leaves/leaves.service';
import { LeaveRequestDetailDialogComponent } from '../../components/dialogs/leave-request-detail-dialog/leave-request-detail-dialog.component';
// view table
export interface PeriodicElement {
  createAt: Date;
  leave_start_date: Date;
  leave_end_date: Date;
  leaveDuration: number;
  leaveType: string;
  approver: string;
  status: string;
  leave_reason: string;
  requestorName: string;
}




@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.scss'
})
export class LeavesComponent {

}
