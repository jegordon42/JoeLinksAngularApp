import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

export enum Page {
  UNSPECIFIED,
  CREATE_NEW,
  LINKS,
  ABOUT
}

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css'],
  standalone: true,
  imports : [
    MatIconModule,
  ]
})
export class Sidenav {
  activePage = Page.UNSPECIFIED;
  hoveredPage = Page.UNSPECIFIED;
  Page = Page;

  constructor(private router: Router) {
    switch(router.url){
      case '/':
        this.activePage = Page.CREATE_NEW;
        break;
      case '/links':
        this.activePage = Page.LINKS;
        break;
      case '/about':
        this.activePage = Page.ABOUT;
    }
  }

  setActive(option: Page){
    switch(option){
      case Page.CREATE_NEW:
        this.router.navigate(['/']);
        break;
      case Page.LINKS:
        this.router.navigate(['/links']);
        break;
      case Page.ABOUT:
        this.router.navigate(['/about']);
    }
    this.activePage = option;
  }

  setHover(option: Page){
    this.hoveredPage = option;
  }

  getOptionClass(option: Page): string{
    if (this.activePage == option) 
      return 'active'
    if (this.hoveredPage == option) 
      return 'hover'
    return ''
  }
}
