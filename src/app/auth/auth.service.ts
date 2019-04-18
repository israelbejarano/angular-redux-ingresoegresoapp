import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);

    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(resp => {
      console.log(resp);
      this.router.navigate(['/']);
    }).catch(error => {
      console.error(error);
      Swal.fire('Error en el registro', error.message, 'error');
    });
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(resp => {
      console.log(resp);
      this.router.navigate(['/']);
    }).catch(error => {
      console.error(error);
      Swal.fire('Error en el login', error.message, 'error');
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(fbUser => {
      if (fbUser == null) {
        this.router.navigate(['/login']);
      }
      return fbUser != null;
    }));
  }
}
