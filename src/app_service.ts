import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private sidenavOpenedSource = new Subject<boolean>();

  sidenavOpened$ = this.sidenavOpenedSource.asObservable();

  openSideNav() {
    this.sidenavOpenedSource.next(true);
  }

  closeSideNav() {
    this.sidenavOpenedSource.next(false);
  }
}