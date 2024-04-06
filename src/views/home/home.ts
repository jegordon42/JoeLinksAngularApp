import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef, ChangeDetectionStrategy, Optional } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'
import { Sidenav } from 'src/components/sidenav/sidenav';
import { Login } from 'src/components/login/login';
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";
import { AppService } from 'src/app_service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MetadataService } from 'src/metadata_service';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[
    CommonModule,
    RouterModule,
    MatSidenavModule,
    Sidenav,
    Login,
  ]
})
export class Home implements OnInit {
  pageWidth = this.getPageWidth();
  containerHeight = this.getContainerHeight();
  sidenavOpened = false;
  user: User | null = null;
  loading = true;
  subscription: Subscription;
  auth:Auth;

  constructor(
    private appService: AppService,
    private cd: ChangeDetectorRef,
    @Optional() private metadataService: MetadataService
    ) {
    this.auth = getAuth();
    
    this.subscription = appService.sidenavOpened$.subscribe(
      sidenavOpened => {
        this.sidenavOpened = sidenavOpened;
        this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
    console.log('yo')
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.adjustForPageWidth();
      if(!this.metadataService){
        this.loading = false;
      }
      this.cd.detectChanges();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:UIEvent) {
    this.adjustForPageWidth();
  }

  adjustForPageWidth(){
    this.pageWidth = this.getPageWidth();
    this.containerHeight = this.getContainerHeight();
    if(this.pageWidth < 1200)
      this.appService.closeSideNav();
    else if(this.user)
      this.appService.openSideNav();
  }

  getPageWidth(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200; 
  }

  getContainerHeight(): number {
    if(this.metadataService)
      return 0;
    const parentElement = document.getElementById("joe");
    if(parentElement)
      return parentElement.scrollHeight - 25;
    return 500; 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
