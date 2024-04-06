import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppService } from 'src/app_service';
import { Subscription } from 'rxjs';
import { getAuth, Auth, signOut, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: true,
  imports:[
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class Header implements OnInit{
  pageWidth = this.getpageWidth();
  showMenuButton = false;
  showLogoText = true;
  showProfileCircle = false;
  sidenavOpened = true;
  subscription: Subscription;
  auth:Auth;
  logoText = "";

  constructor(private appService: AppService){
    this.auth = getAuth()
    this.subscription = appService.sidenavOpened$.subscribe(
      sidenavOpened => {
        this.sidenavOpened = sidenavOpened;
    });
    this.setShownElements();
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.showProfileCircle = true;
        this.logoText = user.displayName ? user.displayName[0] : '?';
        if(this.getpageWidth() > 1200){{
          this.appService.openSideNav();
        }}
      } else {
        this.showProfileCircle = false;
        this.appService.closeSideNav();
      }
    });
  }

  logout(){
    this.appService.closeSideNav();
    signOut(this.auth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:UIEvent) {
    this.pageWidth = this.getpageWidth();
    this.setShownElements();
  }

  setShownElements(){
    if(this.pageWidth < 1200)
      this.showMenuButton = true;
    else
      this.showMenuButton = false;

    if(this.pageWidth < 400)
      this.showLogoText = false;
    else
      this.showLogoText = true;
  }

  toggleMenu(){
    if(this.sidenavOpened)
      this.appService.closeSideNav();
    else
      this.appService.openSideNav();
  }

  getpageWidth(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200; 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
