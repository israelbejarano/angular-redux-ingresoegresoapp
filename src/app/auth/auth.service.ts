import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(private afAuth: AngularFireAuth, private router: Router,
              private afBD: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);
      if (fbUser) {
        this.userSubscription = this.afBD.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe((usuarioObj: any) => {
            const newUser = new User(usuarioObj);
            console.log(newUser);
            this.usuario = newUser;
            this.store.dispatch(new SetUserAction(newUser));
        });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(resp => {
      console.log(resp);
      const user: User = {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      };
      // crea registro en Firebase
      this.afBD.doc(`${user.uid}/usuario`).set(user).then(() => {
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
      }).catch(error => {
        console.error(error);
        Swal.fire('Error guardando en Firebase BBDD', error.message, 'error');
      });
    }).catch(error => {
      this.store.dispatch(new DesactivarLoadingAction());
      console.error(error);
      Swal.fire('Error en el registro', error.message, 'error');
    });
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(resp => {
      console.log(resp);
      this.store.dispatch(new DesactivarLoadingAction());
      this.router.navigate(['/']);
    }).catch(error => {
      this.store.dispatch(new DesactivarLoadingAction());
      console.error(error);
      Swal.fire('Error en el login', error.message, 'error');
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
    this.store.dispatch(new UnsetUserAction());
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(fbUser => {
      if (fbUser == null) {
        this.router.navigate(['/login']);
      }
      return fbUser != null;
    }));
  }

  getUsuario() {
    return {...this.usuario};
  }
}
