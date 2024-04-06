import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { MetadataService } from 'src/metadata_service';
@Component({
  selector: 'lookup',
  templateUrl: './lookup.html',
  styleUrls: ['./lookup.css'],
  standalone: true,
  imports:[
    CommonModule,
    MatButtonModule
  ]
})
export class Lookup implements OnInit{
  linkName:string | null;
  linkExists = false;
  loading = true;

  constructor(
    private readonly route: ActivatedRoute, 
    readonly router: Router,
    private firestore: Firestore,
    @Optional() private metadataService: MetadataService
  ){
    this.linkName = this.route.snapshot.paramMap.get('linkName');
  }

  async ngOnInit(): Promise<void> {
    this.generateMetadata();
    this.lookupLink();
  }

  async lookupLink(): Promise<void> {
    if(this.linkName){ 
      const docRef = doc(this.firestore, 'links', this.linkName);
      const data = await getDoc(docRef);
      if(data.exists()){
        if (!this.metadataService) {
          const visits = data.get('visits') ?? [];
          visits.push(new Date());
          updateDoc(docRef, {visits})
        }
        this.linkExists = true;
        window.location.href = data.get('targetUrl');
      }
      else{
        this.loading = false;
      }
    }
  }

  generateMetadata(){
    if (this.metadataService) {
      let title = "Joe Links";
      if(this.linkName){
        title = "";
        this.linkName.split("-").forEach((titleWord)=>{
          if(titleWord){
            let capitalizedTitleWord = titleWord[0].toUpperCase() + titleWord.slice(1,titleWord.length);
            title += capitalizedTitleWord + " ";
          }
        });
      }
      this.metadataService.updateMetadata({
        title,
        description: 'This is a description'
      });
    }
  }

  navigateToCreate(linkName: string | null){
    if(linkName)
      this.router.navigate(['/'], {queryParams: {link: linkName}})
  }
}
