import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { getAuth, Auth, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'create-link',
  templateUrl: './create_link.html',
  styleUrls: ['./create_link.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
})
export class CreateLink implements OnInit{
  linkName = new FormControl('', [Validators.required]);
  targetUrl = new FormControl('', [Validators.required]);;
  auth:Auth;
  owner = "";

  constructor(
    private route: ActivatedRoute,  
    private firestore: Firestore
  ) {
    this.auth = getAuth();
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if(params['link'])
          this.linkName.setValue(params['link']);
      }
    );
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.owner = user.email ? user.email : "";
      } else {
        this.owner = ""
      }
    });
  }

   async createLink(){
    if(!this.owner){
      alert("not logged in");
      return;
    }
    if(!this.linkName.value){
      alert("Enter linkName");
      return;
    }
    if(!this.targetUrl.value){
      alert("Enter url");
      return;
    }
    console.log(this.targetUrl.value.includes(' '));
    if(this.targetUrl.value.includes(' ')){
      alert("Invalid url! No spaces allowed.");
      return;
    }
    if(this.targetUrl.value.includes(',')){
      alert("Invalid url! No commas allowed.");
      return;
    }
    if(this.targetUrl.value.includes('\'')){
      alert("Invalid url! No apostrophes allowed.");
      return;
    }
    if(!this.targetUrl.value.startsWith('https://') && !this.targetUrl.value.startsWith('http://')){
      this.targetUrl.setValue('https://' + this.targetUrl.value);
    }
    if(!this.isValidHttpUrl(this.targetUrl.value)){
      alert("Invalid url!");
      return;
    }
    if(this.linkName.value && this.targetUrl.value){
      const docRef = doc(this.firestore, 'links', this.linkName.value);
      const data = await getDoc(docRef);
      if(data.exists()){
        alert("This link exists already!");
        return;
      }
      else {
        setDoc(docRef, {targetUrl: this.targetUrl.value, owner: this.owner}).then(()=>{
          alert(this.linkName.value + ' created successfully!');
          this.linkName.setValue('');
          this.targetUrl.setValue('');
        });
      }
    }
  }

   isValidHttpUrl(urlString: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(urlString);
  }
}
