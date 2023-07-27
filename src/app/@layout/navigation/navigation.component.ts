import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/@dw/services/layout.service';

@Component({
  selector: 'po-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private layoutService: LayoutService,) { }

  ngOnInit(): void {
  }
  openSidenav() {
    this.layoutService.openSidenav();
  }
}
