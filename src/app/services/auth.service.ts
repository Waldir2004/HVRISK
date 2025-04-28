import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAuth(){
    return getAuth();
  }

  loginGoogle() {
    return signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

}
