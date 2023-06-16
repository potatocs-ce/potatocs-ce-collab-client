import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { DocumentComponent } from './document/document.component';
import { EditorComponent } from './editor/editor.component';
import { SpaceComponent } from './space.component';
import { SpaceGuard } from 'src/@dw/guard/space.guard';

const routes: Routes = [
 {
    path: 'space/:spaceTime',
    component: SpaceComponent,
    canActivate: [SpaceGuard]
  },
  {
    path: 'editor/ctDoc',
    component: EditorComponent,
    // canActivate: [SpaceGuard]
  },
  {
    path: 'space/:spaceTime/doc',
    component: DocumentComponent,
    canActivate: [SpaceGuard]
  },
  {
    path: 'space/calendar',
    component: CalendarListComponent,
    // canActivate: [SpaceGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceRoutingModule { }
