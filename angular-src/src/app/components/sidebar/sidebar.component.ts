import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  /*
  export interface MenuItem
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    queryParams?: {
        [k: string]: any;
    };
    items?: MenuItem[] | MenuItem[][];
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
    routerLinkActiveOptions?: any;
    separator?: boolean;
    badge?: string;
    badgeStyleClass?: string;
    style?: any;
    styleClass?: string;
    title?: string;
    id?: string;
   */
  items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [
      {
        label: 'Tasks',
        routerLink: ['tasks'],
        routerLinkActiveOptions: {exact: true},
        id: 'tasks-item'
      }
    ]
  }

}
