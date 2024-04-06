import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { getAuth, signInWithRedirect, setPersistence, GoogleAuthProvider, Auth, browserLocalPersistence, signInWithPopup } from "firebase/auth";
import { AppService } from 'src/app_service';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class Login{
  auth:Auth;

  constructor(private appService: AppService) {
    this.auth = getAuth();
    appService.closeSideNav();
  }

  async login() {
    setPersistence(this.auth, browserLocalPersistence).then(()=>{
      signInWithPopup(this.auth, new GoogleAuthProvider())
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
    });
  }
}
