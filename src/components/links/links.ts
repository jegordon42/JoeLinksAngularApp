import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule, Sort} from '@angular/material/sort';
import { Firestore, Timestamp, collection, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";

export interface JoeLink {
  linkName: string;
  target: string;
  owner: string;
  visits: number;
  lastAccess: string;
}

const DISPLAYED_COLUMNS: string[] = ['linkName', 'copy', 'target', 'delete', 'owner', 'visits', 'lastAccess'];

@Component({
  selector: 'links',
  templateUrl: './links.html',
  styleUrls: ['./links.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports : [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ]
})
export class Links implements OnInit{
  displayedColumns = DISPLAYED_COLUMNS;
  dataSource = new MatTableDataSource<JoeLink>();
  masterLinksList: JoeLink[] = [];
  displayedLinksList: JoeLink[] = [];
  auth: Auth;
  user: User | null = null;

  constructor(
    private firestore: Firestore, 
    private cd: ChangeDetectorRef,
    private liveAnnouncer: LiveAnnouncer
  ){
    this.auth = getAuth();
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.getLinks();
    });
  }

  async getLinks(){
    this.masterLinksList = [];
    this.displayedLinksList = [];
    const linksCollection = collection(this.firestore, 'links');
    const links = (await getDocs(linksCollection)).docs;
    links.forEach((link)=>{
      let visits = link.get('visits') ?? [];
      let lastAccess = '';
      if(visits.length > 0){
        visits = visits.sort((a: Timestamp, b: Timestamp)=>{
          return b.seconds - a.seconds;
        })
        lastAccess = this.formatDate(visits[0]);
      }
      
      this.masterLinksList.push({
        linkName: 'JoeLinks.Net/' + link.id, 
        target: link.get('targetUrl'), 
        owner: link.get('owner'), 
        visits: visits.length, 
        lastAccess
      })
    });
    this.displayedLinksList = this.masterLinksList.slice();
    this.dataSource = new MatTableDataSource<JoeLink>(this.displayedLinksList);
    this.cd.detectChanges();
  }

  async openDeleteDialog(joeLink: JoeLink) {
    if (confirm('Are you sure you want to delete ' + joeLink.linkName + '?')) {
      await deleteDoc(doc(this.firestore, 'links', joeLink.linkName.substring(13)));
      this.dataSource = new MatTableDataSource<JoeLink>();
      this.cd.detectChanges();
      this.getLinks()
      alert(joeLink.linkName + ' deleted!');
    }
  }

  copy(value: string){
    navigator.clipboard.writeText(value);
  }

  formatTarget(target:string) : string{
    if(target.length < 50)
      return target;
    return target.substring(0,50) + '...';
  }

  formatDate(date: Timestamp) : string {
    return date.toDate().toLocaleDateString('en-us', {year:'numeric', month:'short', day:'numeric'});
  }

  announceSortChange(sortState: Sort) {
    if(!sortState.direction)
      this.displayedLinksList = this.masterLinksList.slice();
    else if(sortState.active == 'lastAccess')
      this.sortListByDate(sortState.active, sortState.direction);
    else
      this.sortList(sortState.active, sortState.direction);

    this.dataSource = new MatTableDataSource<JoeLink>(this.displayedLinksList);
    this.cd.detectChanges();

    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  sortList(column: string, direction: string){
    this.displayedLinksList = this.displayedLinksList.sort((a:JoeLink, b:JoeLink)=>{
      let result = a[column as keyof JoeLink] > b[column as keyof JoeLink] ? -1 : 1;
      return direction == 'asc' ? result : result * -1;
    });
  }

  sortListByDate(column: string, direction: string){
    this.displayedLinksList = this.displayedLinksList.sort((a:JoeLink, b:JoeLink)=>{
      if(a[column as keyof JoeLink] == '')
        return 1;
      if(b[column as keyof JoeLink] == '')
        return -1;
      let result = new Date(a[column as keyof JoeLink]) > new Date(b[column as keyof JoeLink]) ? -1 : 1;
      return direction == 'asc' ? result : result * -1;
    });
  }
}
